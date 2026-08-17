# MathJax Renderer Plugin for Hexo

[![npm version][npm-badge]][npm-url]
[![CI][ci-badge]][ci-url]
[![node version][node-badge]][npm-url]

Add support of [MathJax](https://www.mathjax.org/) for [Hexo](https://hexo.io/).

The plugin injects the MathJax script into every generated page through Hexo's
injector, so it works with any theme and any template engine.

## REQUIREMENTS

- Hexo 5.0.0 or above
- Node.js 20 or above

## INSTALL

    $ npm install hexo-renderer-mathjax --save

That is all — Hexo loads plugins from `package.json` automatically. No
`_config.yml` change is needed.

## Sample

Write the following latex code:

    $$
    \frac{\partial u}{\partial t} = h^2 \left( \frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2}\right)
    $$

Then you will get:

![sample](https://raw.githubusercontent.com/phoenixcw/hexo-renderer-mathjax/main/sample.png)

## Upgrading from 0.6.0

Version 0.6.0 replaced Hexo's `ejs` renderer in order to splice the MathJax
script into the layout. That renderer discarded its own output, which left EJS
themes rendering blank pages. It is gone now, and the script is injected after
rendering instead.

If your site somehow relied on this plugin to render `.ejs` templates, install
the real renderer:

    $ npm install hexo-renderer-ejs --save

Sites created with `hexo init`, and every EJS theme, already depend on it.

[npm-badge]: https://img.shields.io/npm/v/hexo-renderer-mathjax.svg
[npm-url]: https://www.npmjs.com/package/hexo-renderer-mathjax
[ci-badge]: https://github.com/phoenixcw/hexo-renderer-mathjax/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/phoenixcw/hexo-renderer-mathjax/actions/workflows/ci.yml
[node-badge]: https://img.shields.io/node/v/hexo-renderer-mathjax.svg
