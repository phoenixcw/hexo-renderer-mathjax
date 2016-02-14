# MathJax Renderer Plugin for Hexo

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Dependency Status][david-badge]][david-url]

Add support of [MathJax](http://www.mathjax.org/) for [Hexo](http://hexo.io/).

## INSTALL

    $ npm install hexo-renderer-mathjax --save

Edit `_config.yml`:

    plugins:
    - hexo-renderer-mathjax

## Sample

Write the following latex code:

    $$
    \frac{\partial u}{\partial t} = h^2 \left( \frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2}\right)
    $$

Then you will get:

![sample](https://raw.githubusercontent.com/phoenixcw/hexo-renderer-mathjax/master/sample.png)

[npm-badge]: https://badge.fury.io/js/hexo-renderer-mathjax.svg
[npm-url]: https://badge.fury.io/js/hexo-renderer-mathjax
[travis-badge]: https://api.travis-ci.org/phoenixcw/hexo-renderer-mathjax.svg
[travis-url]: https://travis-ci.org/phoenixcw/hexo-renderer-mathjax
[coveralls-badge]:https://coveralls.io/repos/phoenixcw/hexo-renderer-mathjax/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/phoenixcw/hexo-renderer-mathjax?branch=master
[david-badge]: https://david-dm.org/phoenixcw/hexo-renderer-mathjax.svg
[david-url]: https://david-dm.org/phoenixcw/hexo-renderer-mathjax