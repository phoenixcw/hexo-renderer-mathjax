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
- A renderer for your theme's templates, e.g. `hexo-renderer-ejs` for EJS
  themes — `hexo init` and every EJS theme already pull it in

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

[npm-badge]: https://img.shields.io/npm/v/hexo-renderer-mathjax.svg
[npm-url]: https://www.npmjs.com/package/hexo-renderer-mathjax
[ci-badge]: https://github.com/phoenixcw/hexo-renderer-mathjax/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/phoenixcw/hexo-renderer-mathjax/actions/workflows/ci.yml
[node-badge]: https://img.shields.io/node/v/hexo-renderer-mathjax.svg
