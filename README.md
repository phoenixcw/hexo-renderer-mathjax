# MathJax Renderer Plugin for Hexo

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Dependency Status][david-badge]][david-url]

Add support of [MathJax](http://www.mathjax.org/) for [Hexo](http://hexo.io/).

## INSTALL

    $ npm install hexo-renderer-mathjax2 --save

## CONFIG

If you want to customize the mathjax js src, Edit `_config.yml`:

    mathjax:
      cnd: your-mathjax-cdn-src

## Sample

Write the following latex code:

    $$
    \frac{\partial u}{\partial t} = h^2 \left( \frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2}\right)
    $$

Then you will get:

![sample](https://raw.githubusercontent.com/Mybrc91/hexo-renderer-mathjax/master/sample.png)
