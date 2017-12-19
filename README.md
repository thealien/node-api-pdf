node-api-pdf
===

Simple utility to create PDF version of Node.js API docs.


Installation
---

```
$ npm install -g node-api-pdf
```

One thing: for gnu/linux without a graphical environment install `xvfb` before
```bash
$ sudo apt-get install xvfb # or equivalent
```

Command Line Usage
---

```
Usage: index [options] [versions...]

  Versions:

    This is Node.js version. By default it is "current". Also can be "latest", strict version like "7.10.0" or major
    version like "7" (it means latest 7.x). And of course you can list versions with space like "current 4 latest"

  Options:

    -o, --output                     Output directory (if no configured CWD will be used)
    -x, --use-xvfb                   Use it if run on system without a graphical environment.
                                     Please install "xvfb" before (like "sudo apt-get install xvfb" or equivalent)
    -c, --config <customConfigFile>  Custom config file (js/json) where listed Node.js versions and render options.
                                     Example available in documentation or check "config.js" file placed in module distr
    -h, --help                       output usage information
```

Examples
---

Create pdf for installed Node.js version
```
$ node-api-pdf
```

..or the same thing but using argument `current`
```
$ node-api-pdf current
```

Now lets create pdf for Node.js versions 9.3.0
```
$ node-api-pdf 9.3.0
```

Create pdf for latest 8.x and save to ~/node-docs/
```
$ node-api-pdf 8 --output ~/node-docs/
```

If we want pdf for latest Node.js versions and our system has not graphical environment (dont forget install xvfb before)
```
$ node-api-pdf latest --use-xvfb
```

One more with multiple versions (latest 6.x and 8.9.3) and custom config file (js or json allowed)

```
$ node-api-pdf 6 8.9.3 -x --config ~/custom-config.json
```

What about config file?
So, default config (with comments) is placed in PACKAGE_ROOT/config.js (check it on [GitHub](https://github.com/thealien/node-api-pdf/blob/master/config.js)).
It has 2 sections: `docs` and `pdfGenerator`.
`docs` has map of versions to create pdf.
`pdfGenerator` has settings for renderer: out directory, xvfb usage and options for [`electron-pdf`](https://www.npmjs.com/package/electron-pdf).

Simplified version of config:
```javascript
module.exports = {
    docs: {
        7: {
            enabled: false
        },
        8: {
            enabled: true
        },
        latest: {
            enabled: false
        },
        current: {
            enabled: true
        }
    },

    pdfGenerator: {
        /**
         * Directory for created PDF
         */
        out: '~/devdocs/',

        /**
         * Use xvfb-run to execute electron without x-server
         */
        xvfb: true,

        /**
         * https://www.npmjs.com/package/electron-pdf#all-available-options
         */
        electronPdf: {
            // Can be A3, A4, A5, Legal, Letter, Tabloid or an Object containing height and width in microns
            pageSize: 'A5',
        }
    }
};

```

License
---

MIT