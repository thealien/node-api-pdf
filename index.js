var path = require('path');
var phantomBridge = require('phantom-bridge');

var distUrl = 'https://nodejs.org/dist/';
var docs = [/*{
    version: 'latest-v0.12.x',
    pagePrepare: function () {
        var doc = document;
        doc.getElementById('nav').style.display = 'none';
        doc.getElementById('column2').style.display = 'none';
        doc.getElementById('footer').style.display = 'none';
        doc.getElementById('column1').style.width = '1024px';
    }
},*/ {
    version: 'latest-v6.x',
    pagePrepare: function () {
        var doc = document;
        doc.getElementsByTagName('html')[0].style.height = 'auto'
        doc.body.style.height = 'auto'
        doc.getElementById('gtoc').style.display = 'none';
        doc.getElementById('column2').style.display = 'none';
        doc.getElementById('column1').style.marginLeft = '0';
    }
}];

docs.forEach(function (doc) {
    var pagePrepare = null;
    if (doc.pagePrepare) {
        pagePrepare = doc.pagePrepare.toString();
    }
    pagePrepare = JSON.stringify(pagePrepare);
    var cp = phantomBridge(path.join(__dirname, 'rasterize.js'), [
        distUrl + doc.version + '/docs/api/index.html',
        'out/' + doc.version + '.pdf',
        '1024*768',
        pagePrepare,
        '--ignore-ssl-errors=true',
        '--local-to-remote-url-access=true',
        '--ssl-protocol=any'
    ]);

    cp.stdout.pipe(process.stdout);
});