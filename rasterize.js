"use strict";
var page = require('webpage').create(),
    system = require('system'),
    address, output, size, pagePrepare;

address = system.args[1];
output = system.args[2];
page.viewportSize = {width: 1024, height: 768};
size = system.args[3].split('*');
page.paperSize = {width: size[0], height: size[1], margin: {top: '15px', bottom: '15px'}};

pagePrepare = system.args[4] && JSON.parse(system.args[4]);
if (pagePrepare) {
    pagePrepare = (new Function('', 'return ' + pagePrepare))();
}

page.open(address, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit(1);
    } else {
        if (pagePrepare) {
            page.evaluate(pagePrepare);
        }
        window.setTimeout(function () {
            page.render(output);
            phantom.exit();
        }, 200);
    }
});
