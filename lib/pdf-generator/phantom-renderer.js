/*globals phantom, window*/
"use strict";
var page = require('webpage').create(),
    system = require('system'),
    options;

options = JSON.parse(system.args[1]);

if (options.paperSize) {
    page.paperSize = options.paperSize;
}

log('Open "' + options.url + '"');

page.onConsoleMessage = log;
page.open(options.url, function (status) {
    if (status !== 'success') {
        error('Unable to load the address!');
        return phantom.exit(1);
    }

    log('Page loaded');
    if (options.css) {
        page.evaluate(function(css) {
            var style = document.createElement('style'),
                text  = document.createTextNode(css);

            style.setAttribute('type', 'text/css');
            style.appendChild(text);

            document.head.insertBefore(style, document.head.firstChild);
        }, options.css);
    }

    window.setTimeout(function () {
        log('Start render PDF');
        page.render(options.filepath);
        log('Finish render PDF');
        phantom.exit();
    }, 500);
});

function log (message) {
    console.log(message);
}

function error (message) {
    console.error(message);
}
