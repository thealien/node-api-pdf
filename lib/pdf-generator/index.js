"use strict";

var util = require('util'),
    path = require('path'),
    phantomBridge = require('phantom-bridge');

var PdfGenerator = function (config) {
    this.out = config.out || this.out;
    this.stdOut = config.stdOut || this.stdOut;
    this.size = config.size || this.size;
};

PdfGenerator.prototype = {

    /**
     *
     */
    phantomRenderer: path.join(__dirname, 'phantom-renderer.js'),

    /**
     *
     */
    out: null,

    /**
     *
     */
    stdOut: null,

    /**
     *
     */
    size: '1024*768',

    /**
     *
     * @param version
     * @param options
     */
    gen: function (version, options) {
        options = options || {};
        var url = this.resolveApiDocUrl(version),
            filename = version + '.pdf',
            filepath = path.join(this.out, filename);

        this.renderToPdf(url, filepath, this.size, options);
    },

    /**
     *
     * @param {String} url
     * @param {String} filepath
     * @param {String} size
     * @param {Object} options
     */
    renderToPdf: function (url, filepath, size, options) {
        var cp = phantomBridge(path.join(__dirname, 'phantom-renderer.js'), [
            url,
            filepath,
            size,
            JSON.stringify(options),
            '--ignore-ssl-errors=true',
            '--local-to-remote-url-access=true',
            '--ssl-protocol=any'
        ]);

        if (this.stdOut) {
            cp.stdout.pipe(this.stdOut);
        }
    },

    /**
     *
     * @param {String} version
     * @returns {String}
     */
    resolveApiDocUrl: function (version) {
        return util.format('https://nodejs.org/dist/%s/docs/api/all.html', version);
    }

};

exports.PdfGenerator = PdfGenerator;

exports.create = function (config) {
    return new PdfGenerator(config);
};