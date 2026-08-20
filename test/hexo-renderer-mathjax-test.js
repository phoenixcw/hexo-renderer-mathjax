'use strict';

const assert = require('node:assert/strict');
const {describe, it} = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Hexo = require('hexo');

const MODULE_PATH = require.resolve('../lib/hexo-renderer-mathjax.js');

// The file now holds the MathJax.Hub.Config block only; the <script src> tag is
// built at load time from the site config.
const MATHJAX_CONFIG = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'mathjax.html'), 'utf8'
).trim();

const DEFAULT_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
const CUSTOM_SRC = 'https://cdn.jsdelivr.net/npm/mathjax@2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML';

global.hexo = new Hexo(__dirname, {silent: true});

// A real site always ships a template renderer; load it first so we can prove
// the plugin coexists with it instead of clobbering it.
require('hexo-renderer-ejs');
require('../index.js');

// Load the plugin again against a throwaway site so one test can set
// `mathjax:` in _config.yml without disturbing the default-config instance.
function snippetWith(mathjax) {
  const scoped = new Hexo(__dirname, {silent: true});
  if (arguments.length > 0) scoped.config.mathjax = mathjax;

  const realHexo = global.hexo;
  delete require.cache[MODULE_PATH];
  global.hexo = scoped;

  try {
    require(MODULE_PATH);
    return scoped.extend.injector.getText('body_end');
  } finally {
    global.hexo = realHexo;
    delete require.cache[MODULE_PATH];
  }
}

const LAYOUT = '<html><head></head><body><h1><%= title %></h1></body></html>';
const LOCALS = {title: 'hello'};

describe('hexo-renderer-mathjax', function() {

  describe('injector registration', function() {

    it('registers a single MathJax snippet at body_end', function() {
      const registered = hexo.extend.injector.get('body_end');
      assert.equal(registered.length, 1);
      assert.ok(registered[0].startsWith(MATHJAX_CONFIG));
    });

    it('loads MathJax from a pinned version over https', function() {
      const text = hexo.extend.injector.getText('body_end');
      assert.match(text, /src="https:\/\/\S+\/mathjax\/\d+\.\d+\.\d+\/MathJax\.js/);
    });

    it('loads the script without blocking page rendering', function() {
      assert.match(hexo.extend.injector.getText('body_end'), /<script\s+async\b/);
    });

    // The integrity hash is tied to the version in the src above; bumping one
    // without the other stops MathJax from loading at all.
    it('pins the CDN payload with subresource integrity', function() {
      const text = hexo.extend.injector.getText('body_end');
      assert.match(text, /integrity="sha512-[^"]+"/);
      // SRI is only enforced on a cross-origin script when the request uses CORS.
      assert.match(text, /crossorigin="anonymous"/);
    });

    // TeX-AMS-MML_HTMLorMML does not pull in TeX/color.js, so \colorbox stays
    // an undefined macro unless the snippet asks for the extension.
    it('requests the TeX color extension', function() {
      const text = hexo.extend.injector.getText('body_end');
      assert.match(text, /TeX:\s*{\s*extensions:\s*\["color\.js"\]/);
    });

    it('does not register anything at the other entries', function() {
      for (const entry of ['head_begin', 'head_end', 'body_begin']) {
        assert.deepEqual(hexo.extend.injector.get(entry), [], entry);
      }
    });

  });

  // A site behind the Great Firewall cannot reach cdnjs reliably, so the CDN
  // has to be swappable from _config.yml instead of by editing node_modules.
  describe('cdn configuration', function() {

    it('uses the bundled cdnjs url and hash when nothing is configured', function() {
      const text = snippetWith();
      assert.ok(text.includes(`src="${DEFAULT_SRC}"`));
      assert.match(text, /integrity="sha512-/);
    });

    it('loads MathJax from a configured src', function() {
      const text = snippetWith({src: CUSTOM_SRC});
      assert.ok(text.includes(`src="${CUSTOM_SRC}"`));
      assert.ok(!text.includes(DEFAULT_SRC));
    });

    // Our hash describes the cdnjs payload only. Emitting it next to somebody
    // else's url would make the browser reject the script instead of running it.
    it('drops the bundled hash when the src is overridden', function() {
      const text = snippetWith({src: CUSTOM_SRC});
      assert.ok(!text.includes('integrity='), 'kept an integrity hash for a foreign url');
      assert.ok(!text.includes('crossorigin='), 'kept crossorigin without a hash to enforce');
    });

    it('pins a custom src when the site supplies its own hash', function() {
      const text = snippetWith({src: CUSTOM_SRC, integrity: 'sha384-abc123'});
      assert.ok(text.includes('integrity="sha384-abc123"'));
      assert.ok(text.includes('crossorigin="anonymous"'));
    });

    it('lets an explicit empty integrity opt out of SRI on the default cdn', function() {
      const text = snippetWith({integrity: null});
      assert.ok(text.includes(`src="${DEFAULT_SRC}"`));
      assert.ok(!text.includes('integrity='));
    });

    it('escapes the configured src instead of breaking out of the attribute', function() {
      const text = snippetWith({src: 'https://example.com/MathJax.js?a=1&b=2"onload="alert(1)'});
      assert.ok(text.includes('src="https://example.com/MathJax.js?a=1&amp;b=2&quot;onload=&quot;alert(1)"'));
      assert.ok(!text.includes('onload="alert'));
    });

    it('falls back to the defaults when mathjax is not a config object', function() {
      for (const value of [true, 'jsdelivr', null]) {
        const text = snippetWith(value);
        assert.ok(text.includes(`src="${DEFAULT_SRC}"`), `mathjax: ${value}`);
      }
    });

    it('still injects the tex config alongside a custom src', function() {
      const text = snippetWith({src: CUSTOM_SRC});
      assert.ok(text.startsWith(MATHJAX_CONFIG));
      assert.match(text, /TeX:\s*{\s*extensions:\s*\["color\.js"\]/);
    });

  });

  describe('injection into rendered HTML', function() {

    it('injects the snippet before the closing body tag', function() {
      const out = hexo.extend.injector.exec('<html><body><p>hi</p></body></html>');
      assert.ok(out.includes('MathJax.js'));
      assert.ok(out.indexOf('MathJax.js') < out.indexOf('</body>'));
    });

    it('keeps the original document intact', function() {
      const out = hexo.extend.injector.exec('<html><body><p>hi</p></body></html>');
      assert.ok(out.includes('<p>hi</p>'));
      assert.ok(out.includes('</html>'));
      assert.equal(out.split('</body>').length, 2);
    });

    it('does not inject twice when run over its own output', function() {
      const once = hexo.extend.injector.exec('<html><body><p>hi</p></body></html>');
      assert.equal(hexo.extend.injector.exec(once), once);
    });

    it('leaves documents without a body tag untouched', function() {
      const input = '<p>fragment</p>';
      assert.equal(hexo.extend.injector.exec(input), input);
    });

  });

  // Regression tests for the 0.6.0 renderer hijack, which returned undefined
  // from the async renderer and never set a compile function.
  describe('template rendering is left working', function() {

    it('keeps the ejs renderer registered for both async and sync', function() {
      const renderer = hexo.extend.renderer;
      assert.ok(renderer.get('ejs'), 'no async ejs renderer');
      assert.ok(renderer.get('ejs', true), 'no sync ejs renderer');
    });

    it('renders ejs asynchronously instead of returning undefined', async function() {
      const out = await hexo.render.render({text: LAYOUT, engine: 'ejs'}, LOCALS);
      assert.equal(typeof out, 'string');
      assert.ok(out.includes('<h1>hello</h1>'));
    });

    it('renders ejs synchronously instead of echoing the source', function() {
      const out = hexo.render.renderSync({text: LAYOUT, engine: 'ejs'}, LOCALS);
      assert.equal(typeof out, 'string');
      assert.ok(out.includes('<h1>hello</h1>'));
      assert.ok(!out.includes('<%='));
    });

    it('exposes a compile function so Hexo can cache views', function() {
      const compile = hexo.extend.renderer.get('ejs').compile;
      assert.equal(typeof compile, 'function');
      assert.ok(compile({text: LAYOUT})(LOCALS).includes('<h1>hello</h1>'));
    });

  });

  describe('hexo version guard', function() {

    it('fails with a readable message when the injector is missing', function() {
      const realHexo = global.hexo;
      delete require.cache[MODULE_PATH];
      global.hexo = {extend: {}};

      try {
        assert.throws(
          () => require(MODULE_PATH),
          /hexo-renderer-mathjax requires Hexo 5\.0\.0 or above/
        );
      } finally {
        global.hexo = realHexo;
        delete require.cache[MODULE_PATH];
      }
    });

  });

  describe('end to end', function() {

    it('renders the template and injects MathJax into the result', async function() {
      const html = await hexo.render.render({text: LAYOUT, engine: 'ejs'}, LOCALS);
      const out = hexo.extend.injector.exec(html);
      assert.ok(out.includes('<h1>hello</h1>'));
      assert.ok(out.includes('MathJax.js'));
      assert.ok(out.indexOf('<h1>hello</h1>') < out.indexOf('MathJax.js'));
    });

  });

});
