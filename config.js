const path = require('path');
const outDir = path.resolve(process.cwd());

module.exports = {
    docs: {
        '0.10': {
            enabled: true
        },
        0.12: {
            enabled: false
        },
        4: {
            enabled: false
        },
        5: {
            enabled: false
        },
        6: {
            enabled: false
        },
        7: {
            enabled: false
        },
        8: {
            enabled: false
        },
        9: {
            enabled: false
        },
        latest: {
            enabled: false
        },
        current: {
            enabled: false
        }
    },

    pdfGenerator: {
        /**
         * Directory for created PDF
         */
        out: outDir,

        /**
         * Use xvfb-run to execute electron without x-server
         */
        xvfb: false,

        /**
         * https://www.npmjs.com/package/electron-pdf#all-available-options
         */
        electronPdf: {
            // Can be A3, A4, A5, Legal, Letter, Tabloid or an Object containing height and width in microns
            pageSize: 'A4',

            // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions
            browserConfig: {},

            // Whether to print CSS backgrounds.
            printBackground: false,

            // true for landscape, false for portrait
            landscape: false,

            /**
             * Specify the type of margins to use
             * 0 - default margins
             * 1 - no margins (electron-pdf default setting)
             * 2 - minimum margins
             */
            marginsType: 0,

            /**
             * Disable HTTP caching
             */
            disableCache: false
        }
    }
};
