/*global describe,it*/
'use strict';

var Hexo = require('hexo');
global.hexo = new Hexo(__dirname, {silent: true});

var expect = require('chai').expect,
  should = require('chai').should();

// load render
require('../index.js');

describe('hexo-renderer-matjax', function() {


  describe('should register renderer', function() {
    it('register category_transform', function() {
      var renderer = hexo.extend.renderer;
      should.exist(renderer, "render don't exist");
      should.exist(renderer.list(), "no renderer");
      should.not.equal(renderer.list().length, 0, "no renderer");
      should.exist(renderer.get('ejs'), "no ejs renderer");
    });
  });

});
