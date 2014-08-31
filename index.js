var path = require('path');
var ejs = require('ejs');
var file = hexo.file;

var layout = 'layout.ejs';
var bodyTag = '</body>';
var mathjaxScript = file.readFileSync(path.join(__dirname, 'mathjax.html'));

hexo.extend.renderer.register('ejs', 'html', function(data, options, callback) {
    var path = options.filename = data.path;
    var content = data.text;
    if (layout === path.substring(path.length - layout.length))
        content = content.replace(bodyTag, mathjaxScript + '\n' + bodyTag);
    callback(null, ejs.render(content, options));
});