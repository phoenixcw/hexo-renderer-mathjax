# MathJax Renderer Plugin for Hexo

Clone from [phoenixcw](https://github.com/phoenixcw/hexo-renderer-mathjax) and update.

Add support of [MathJax](http://www.mathjax.org/) for [Hexo](http://hexo.io/).

## INSTALL

    $ npm install hexo-renderer-mathjax2 --save

## CONFIG

If you want to customize the mathjax js src, Edit `_config.yml`:

    mathjax:
      cdn: your-mathjax-cdn-src

## Sample

Write the following latex code:

    $$
    \frac{\partial u}{\partial t} = h^2 \left( \frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2}\right)
    $$

Then you will get:

![sample](https://raw.githubusercontent.com/Mybrc91/hexo-renderer-mathjax/master/sample.png)
