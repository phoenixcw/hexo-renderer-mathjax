var path = require('path');
var ejs = require('ejs');
var fs = require('hexo-fs');



var layout = 'layout.ejs';
var bodyTag = '</body>';
var mathjaxScript = fs.readFileSync(path.join(__dirname, 'mathjax.html'));

hexo.extend.renderer.register('ejs', 'html', function(data, options) {
    var path = options.filename = data.path;
    var content = data.text;
    if (!isEmpty(hexo.config.mathjax) && !isEmpty(hexo.config.mathjax.cdn)) {
        content = content.replace(bodyTag, mathjaxScript +'\n' +'<script async src="' + hexo.config.mathjax.cdn + '" id="MathJax-script"></script>' +'\n' + bodyTag);
    }else{
        content = content.replace(bodyTag, mathjaxScript
        +'<script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" id="MathJax-script"></script>' +'\n' + bodyTag);
    }
    return ejs.render(content, options);
},true);

function isEmpty(obj)
{
    if (obj!==null && obj !==undefined && obj!=='') {
        return false;
    }
    return true;

};
