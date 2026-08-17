/* global hexo */
'use strict';

var fs = require('fs');
var path = require('path');

var script = fs.readFileSync(path.join(__dirname, 'mathjax.html'), 'utf8').trim();

if (!hexo.extend.injector) {
    throw new Error(
        'hexo-renderer-mathjax requires Hexo 5.0.0 or above (hexo.extend.injector is missing). ' +
        'Please upgrade Hexo, or install hexo-renderer-mathjax@0.6.0 for older versions.'
    );
}

hexo.extend.injector.register('body_end', script);
