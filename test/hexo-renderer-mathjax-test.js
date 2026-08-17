'use strict';

const assert = require('node:assert/strict');
const {describe, it} = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Hexo = require('hexo');

const MATHJAX_HTML = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'mathjax.html'), 'utf8'
).trim();

global.hexo = new Hexo(__dirname, {silent: true});

// A real site always ships a template renderer; load it first so we can prove
// the plugin coexists with it instead of clobbering it.
require('hexo-renderer-ejs');
require('../index.js');

const LAYOUT = '<html><head></head><body><h1><%= title %></h1></body></html>';
const LOCALS = {title: 'hello'};

describe('hexo-renderer-mathjax', function() {

  describe('injector registration', function() {

    it('registers the MathJax snippet at body_end', function() {
      assert.deepEqual(hexo.extend.injector.get('body_end'), [MATHJAX_HTML]);
    });

    it('registers the MathJax CDN script tag', function() {
      const text = hexo.extend.injector.getText('body_end');
      assert.match(text, /<script src="https:\/\/[^"]+MathJax\.js/);
    });

    it('does not register anything at the other entries', function() {
      for (const entry of ['head_begin', 'head_end', 'body_begin']) {
        assert.deepEqual(hexo.extend.injector.get(entry), [], entry);
      }
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
      const modulePath = require.resolve('../lib/hexo-renderer-mathjax.js');
      const realHexo = global.hexo;
      delete require.cache[modulePath];
      global.hexo = {extend: {}};

      try {
        assert.throws(
          () => require(modulePath),
          /hexo-renderer-mathjax requires Hexo 5\.0\.0 or above/
        );
      } finally {
        global.hexo = realHexo;
        delete require.cache[modulePath];
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
