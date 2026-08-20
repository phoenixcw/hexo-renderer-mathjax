'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Bumping the version means bumping the hash with it; they are one pair.
const DEFAULT_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
const DEFAULT_INTEGRITY = 'sha512-M36RUChWzAh1veeenRZFql7HydLEnkYmoloiCvVrhz402UZgKI93qkV7SsaxtVKdN95Wzajh39ysrXCq34NTsg==';

const config = fs.readFileSync(path.join(__dirname, 'mathjax.html'), 'utf8').trim();

function escapeAttribute(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function scriptTag(options) {
    const src = options.src || DEFAULT_SRC;
    // The pinned hash only matches the default payload, so a custom CDN either
    // brings its own hash or goes unpinned; keeping ours would make the browser
    // refuse the script outright. An explicit `integrity:` (even an empty one)
    // always wins, which is how a user opts out of SRI on the default CDN.
    const integrity = Object.prototype.hasOwnProperty.call(options, 'integrity')
        ? options.integrity
        : (src === DEFAULT_SRC ? DEFAULT_INTEGRITY : null);

    const attributes = [`src="${escapeAttribute(src)}"`];
    if (integrity) {
        attributes.push(`integrity="${escapeAttribute(integrity)}"`);
        // SRI is only enforced on a cross-origin script when the request uses CORS.
        attributes.push('crossorigin="anonymous"');
    }
    attributes.push('referrerpolicy="no-referrer"');

    return `<script async\n        ${attributes.join('\n        ')}></script>`;
}

if (!hexo.extend.injector) {
    throw new Error(
        'hexo-renderer-mathjax requires Hexo 5.0.0 or above (hexo.extend.injector is missing). ' +
        'Please upgrade Hexo, or install hexo-renderer-mathjax@0.6.0 for older versions.'
    );
}

const options = hexo.config && typeof hexo.config.mathjax === 'object' && hexo.config.mathjax !== null
    ? hexo.config.mathjax
    : {};

hexo.extend.injector.register('body_end', `${config}\n${scriptTag(options)}`);
