/*global describe,it*/
'use strict';

var fs = require('fs');
var path = require('path');
var Hexo = require('hexo');
var expect = require('chai').expect;
var should = require('chai').should();

var MATHJAX_HTML = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'mathjax.html'), 'utf8'
).trim();

global.hexo = new Hexo(__dirname, {silent: true});

// A real site always ships a template renderer; load it first so we can prove
// the plugin coexists with it instead of clobbering it.
require('hexo-renderer-ejs');
require('../index.js');

var LAYOUT = '<html><head></head><body><h1><%= title %></h1></body></html>';
var LOCALS = {title: 'hello'};

describe('hexo-renderer-mathjax', function() {

  describe('injector registration', function() {

    it('registers the MathJax snippet at body_end', function() {
      var registered = hexo.extend.injector.get('body_end');
      expect(registered).to.have.length(1);
      expect(registered[0]).to.equal(MATHJAX_HTML);
    });

    it('registers the MathJax CDN script tag', function() {
      expect(hexo.extend.injector.getText('body_end'))
        .to.contain('<script src=')
        .and.to.contain('MathJax.js');
    });

    it('does not register anything at the other entries', function() {
      ['head_begin', 'head_end', 'body_begin'].forEach(function(entry) {
        expect(hexo.extend.injector.get(entry), entry).to.have.length(0);
      });
    });

  });

  describe('injection into rendered HTML', function() {

    it('injects the snippet before the closing body tag', function() {
      var out = hexo.extend.injector.exec('<html><body><p>hi</p></body></html>');
      expect(out).to.contain('MathJax.js');
      expect(out.indexOf('MathJax.js')).to.be.below(out.indexOf('</body>'));
    });

    it('keeps the original document intact', function() {
      var out = hexo.extend.injector.exec('<html><body><p>hi</p></body></html>');
      expect(out).to.contain('<p>hi</p>');
      expect(out.split('</body>')).to.have.length(2);
      expect(out).to.contain('</html>');
    });

    it('does not inject twice when run over its own output', function() {
      var once = hexo.extend.injector.exec('<html><body><p>hi</p></body></html>');
      var twice = hexo.extend.injector.exec(once);
      expect(twice).to.equal(once);
    });

    it('leaves documents without a body tag untouched', function() {
      var input = '<p>fragment</p>';
      expect(hexo.extend.injector.exec(input)).to.equal(input);
    });

  });

  // Regression tests for the 0.6.0 renderer hijack, which returned undefined
  // from the async renderer and never populated the sync renderer store.
  describe('template rendering is left working', function() {

    it('keeps the ejs renderer registered for both async and sync', function() {
      var renderer = hexo.extend.renderer;
      should.exist(renderer.get('ejs'), 'no async ejs renderer');
      should.exist(renderer.get('ejs', true), 'no sync ejs renderer');
    });

    it('renders ejs asynchronously instead of returning undefined', function() {
      return hexo.render.render({text: LAYOUT, engine: 'ejs'}, LOCALS)
        .then(function(out) {
          expect(out).to.be.a('string');
          expect(out).to.contain('<h1>hello</h1>');
        });
    });

    it('renders ejs synchronously instead of echoing the source', function() {
      var out = hexo.render.renderSync({text: LAYOUT, engine: 'ejs'}, LOCALS);
      expect(out).to.be.a('string');
      expect(out).to.contain('<h1>hello</h1>');
      expect(out).to.not.contain('<%=');
    });

    it('exposes a compile function so Hexo can cache views', function() {
      var compile = hexo.extend.renderer.get('ejs').compile;
      expect(compile).to.be.a('function');
      expect(compile({text: LAYOUT})(LOCALS)).to.contain('<h1>hello</h1>');
    });

  });

  describe('end to end', function() {

    it('renders the template and injects MathJax into the result', function() {
      return hexo.render.render({text: LAYOUT, engine: 'ejs'}, LOCALS)
        .then(function(html) {
          var out = hexo.extend.injector.exec(html);
          expect(out).to.contain('<h1>hello</h1>');
          expect(out).to.contain('MathJax.js');
          expect(out.indexOf('<h1>hello</h1>')).to.be.below(out.indexOf('MathJax.js'));
        });
    });

  });

});
