'use strict';

const fs = require('node:fs');
const path = require('node:path');

const script = fs.readFileSync(path.join(__dirname, 'mathjax.html'), 'utf8').trim();

if (!hexo.extend.injector) {
    throw new Error(
        'hexo-renderer-mathjax requires Hexo 5.0.0 or above (hexo.extend.injector is missing). ' +
        'Please upgrade Hexo, or install hexo-renderer-mathjax@0.6.0 for older versions.'
    );
}

hexo.extend.injector.register('body_end', script);
