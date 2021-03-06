'use strict';

const path = require('path');
const {exec} = require('child_process');
const colors = require('colors/safe');
const numeral = require('numeral');

const electronPdfCli = require.resolve('electron-pdf/cli');
if (!electronPdfCli) {
    throw new Error('"electron-pdf/cli" can not be resolved. Please install using "npm install electron-pdf"');
}

const fullDocUrl = 'https://nodejs.org/dist/{VERSION}/docs/api/all.html';

const DEFAULT_VERBOSE = true;
const DEFAULT_OUT = null;
const DEFAULT_XVFB = true;

class PdfGenerator {

    constructor (config) {
        /**
         * Show log messages in console or no
         * @property {Boolean}
         */
        this.verbose = DEFAULT_VERBOSE;
        /**
         * Directory for PDF files
         * @property {String}
         */
        this.out = DEFAULT_OUT;
        /**
         * Use xvfb-run to execute electron without x-server
         * @type {Boolean}
         */
        this.xvfb = DEFAULT_XVFB;

        this.electronPdf = {};
        this.applyConfig(['out', 'xvfb', 'verbose', 'electronPdf'], config);
    }

    /**
     * @protected
     * @param {Array} props List of props allowed to set
     * @param {Object} config Map with key =>  value pairs
     */
    applyConfig (props, config) {
        props.forEach(prop => {
            if (prop in config) {
                this[prop] = config[prop];
            }
        });
    }

    resolveApiDocUrl (version) {
        return fullDocUrl.replace('{VERSION}', version);
    }

    /**
     *
     * @param message
     * @param color
     */
    log (message, color) {
        if (this.verbose) {
            console.log(colors[color || 'white'](String(message).replace(/\s+$/, '')));
        }
    }

    /**
     *
     * @param {String} version
     * @param {String} url
     * @param hide
     * @param styles
     * @returns {*}
     */
    gen (version, {hide, styles}) {
        version = this.normalizeApiVersion(version);
        if (!version) {
            return Promise.reject('Wrong version');
        }

        const url = this.resolveApiDocUrl(version);
        const filename = `${version}.pdf`;
        const filepath = path.join(this.out, filename);
        const name = version;
        const css = this.prepareCss({
            hide,
            styles
        });

        return this.renderToPdf({
            name,
            url,
            filepath,
            css
        });
    }

    /**
     *
     * @param config
     * @returns {string}
     */
    prepareCss ({hide = [], styles = {}}) {
        let css = [];

        css = css.concat(Object.keys(styles).map(function (selector) {
            const style = styles[selector];
            const values = Object.keys(style).map(key => `${key}:${style[key]} !important;`).join('');
            return `${selector} {${values}}`;
        }));

        css = css.concat(hide.map(function (selector) {
            return `${selector} {display:none !important;}`;
        }));

        return css.join('\n');
    }

    /**
     *
     * @param url
     * @param filepath
     * @param name
     * @returns {Promise}
     */
    renderToPdf ({url, filepath, name}) {
        const options = [
            `--input ${url}`,
            `--output ${filepath}`
        ];
        Object.keys(this.electronPdf).forEach(option => {
            const value = this.electronPdf[option];

            if (typeof value === 'boolean') {
                if (value === true) {
                    options.push(`--${option}`);
                }
                return;
            }

            if (typeof value === 'object') {
                if (Object.keys(value).length) {
                    options.push(`--${option} '${JSON.stringify(value)}'`);
                }
                return;
            }

            return options.push(`--${option} ${value}`);
        });

        let cmd = `${electronPdfCli} ${options.join(' ')}`;

        if (this.xvfb) {
            cmd = `xvfb-run -a --server-args="-screen 0, 1024x768x24" ${cmd}`;
        }

        const startTime = Date.now();

        const worker = exec(cmd, {
            silent: true
        });
        worker.stdout.on('data', message => this.log(`-> ${message}`));
        worker.stderr.on('data', message => this.log(`[!] ${message}`, 'red'));

        this.log(`Create PDF for "${name}" Node.js API Documentation:`, 'yellow');

        return new Promise((resolve, reject) => {
            worker.on('error', err => {
                this.log(err, 'red');
                reject(err);
            });

            worker.on('close', () => {
                const timeTaken = numeral((Date.now() - startTime) / 1000).format('00:00');
                this.log(`PDF file created: ${filepath} \n Time taken: ${timeTaken}`, 'green');
                resolve(filepath);
            });
        });
    }

    normalizeApiVersion (version) {
        // current or latest version
        if (version === 'latest') {
            return version;
        }

        if (version === 'current') {
            return process.version;
        }

        // major version
        if (/^(0\.)?\d+$/.test(version)) {
            return `latest-v${version}.x`;
        }

        // strict version
        if (/^\d+\.\d+\.\d+$/.test(version)) {
            return version;
        }
        this.log(`[!!!] Passed version "${version}" ignored. Can be "current", "latest", X or X.Y.Z`, 'red');
        return false;
    }

}

module.exports = PdfGenerator;
