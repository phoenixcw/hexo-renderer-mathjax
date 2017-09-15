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
        content = content.replace(bodyTag, mathjaxScript +'\n' +'<script src=' + hexo.config.mathjax.cdn + '></script>' +'\n' + bodyTag);
    }else{
        content = content.replace(bodyTag, mathjaxScript
        +'<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>' +'\n' + bodyTag);
    }
    ejs.render(content, options);
});

function isEmpty(obj)
{
    if (obj!==null && obj !==undefined && obj!=='') {
        return false;
    }
    return true;

};