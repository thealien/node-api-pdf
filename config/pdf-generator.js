'use strict';

module.exports = {

    /**
     * Directory for created PDF
     */
    out: './out',

    /**
     * Use xvfb-run to execute electron without x-server
     */
    xvfb: true,

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

};
