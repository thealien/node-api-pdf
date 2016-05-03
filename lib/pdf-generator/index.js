"use strict";

var util = require('util'),
    path = require('path'),
    phantomBridge = require('phantom-bridge');

var PdfGenerator = function (config) {
    config = config || {};
    this.applyConfig(['out', 'stdOut', 'paperSize'], config);
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
    paperSize: {
        width: '900',
        height: '1200',
        margin: {
            top: '20',
            bottom: '20'
        }
    },

    /**
     *
     * @param props
     * @param config
     */
    applyConfig: function (props, config) {
        props.forEach(function (prop) {
            if (prop in config) {
                this[prop] = config[prop];
            }
        }, this);
    },

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

        this.renderToPdf(url, filepath, this.paperSize, options);
    },

    /**
     *
     * @param {String} url
     * @param {String} filepath
     * @param {String} paperSize
     * @param {Object} options
     */
    renderToPdf: function (url, filepath, paperSize, options) {
        var args = {
            url: url,
            filepath: filepath,
            paperSize: paperSize,
            options: options
        };

        var cp = phantomBridge(path.join(__dirname, 'phantom-renderer.js'), [
            JSON.stringify(args),
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