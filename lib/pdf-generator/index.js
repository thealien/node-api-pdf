"use strict";

var util = require('util'),
    path = require('path'),
    phantomBridge = require('phantom-bridge'),
    Promise = require('pinkie-promise'),
    colors = require('colors/safe');

var PdfGenerator = function (config) {
    config = config || {};
    this.applyConfig(['out', 'paperSize', 'verbose'], config);
};

PdfGenerator.prototype = {

    /**
     * Show log messages in console or no
     */
    verbose: true,

    /**
     * Directory for PDF files
     */
    out: null,

    /**
     * PaperSize settings for Phantom
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
     */
    phantomRenderer: path.join(__dirname, 'phantom-renderer.js'),

    /**
     * @protected
     * @param {Array} props
     * @param {Object} config
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
     * @param {String} version
     * @param {Object} options
     * @returns {Promise}
     */
    gen: function (version, options) {
        options = options || {};
        var  filename = version + '.pdf',
            filepath = path.join(this.out, filename);

        return this.renderToPdf({
            name: version,
            url: this.resolveApiDocUrl(version),
            filepath: filepath,
            paperSize: this.paperSize,
            css: this.prepareCss(options)
        });
    },

    prepareCss: function (config) {
        var hide = config.hide || [],
            styles = config.style || {},
            css = [];

        css = css.concat(Object.keys(styles).map(function (selector) {
            var style = styles[selector],
                keys = Object.keys(style);

            return util.format(
                '%s {%s}',
                selector,
                keys.map(function (key) {
                    return util.format('%s:%s;', key, style[key]) ;
                }).join('')
            );
        }));

        css = css.concat(hide.map(function (selector) {
            return util.format(
                '%s {display:none;}',
                selector
            );
        }));

        return css.join('\n');
    },

    /**
     *
     * @param {Object} options
     */
    renderToPdf: function (options) {
        var self = this,
            cp = phantomBridge(self.phantomRenderer, [
                JSON.stringify(options),
                '--ignore-ssl-errors=true',
                '--local-to-remote-url-access=true',
                '--ssl-protocol=any'
            ]);

        cp.stdout.on('data', function (message) {
            self.log('-> ' + message);
        });

        cp.stderr.on('data', function (message) {
            self.log('[!] ' + message, 'red');
        });

        self.log(util.format('Create PDF for "%s":', options.name), 'green');

        return new Promise(function (resolve, reject) {
            cp.on('error', function (err) {
                reject(err);
            });

            cp.on('close', function () {
                resolve(options.filepath);
            });
        });
    },

    /**
     *
     * @param {String} version
     * @returns {String}
     */
    resolveApiDocUrl: function (version) {
        return util.format('https://nodejs.org/dist/%s/docs/api/all.html', version);
    },

    log: function (message, color) {
        if (!this.verbose) {
            return;
        }

        console.log(colors[color || 'white'](String(message).replace(/\s+$/, '')));
    }

};

exports.PdfGenerator = PdfGenerator;

exports.create = function (config) {
    return new PdfGenerator(config);
};