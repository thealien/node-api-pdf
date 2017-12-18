'use strict';

const PdfGenerator = require('./src/pdf-generator');
const promiseSerial = require('./src/promise-serial');
const program = require('commander');

const defaultConfig = require('./config.js');
const customConfig = {};

//////////////////////////
// handle args and options
//////////////////////////

let versions = [];

program.arguments('[versions...]', 'Node.js version. By default it is "current". Also can be "latest", strict version ' +
    'like "7.10.0" or major version like "7" (it means latest 7.x). And of course you can list versions with space like ' +
    '"current 4 latest"')
    .action(argVersions => {
        if (argVersions.length) {
            versions = argVersions.map(v => v.trim()).filter(v => v.length);
        }
    });

program.option('-o, --output', 'Output directory (if no configured CWD will be used)');
program.option('-x, --use-xvfb', 'Use it if run on system without a graphical environment. Please install "xvfb" before ' +
    '(like "sudo apt-get install xvfb" or equivalent)');
program.option('-c, --config <customConfigFile>', 'Custom config file (js/json) where listed Node.js versions and ' +
    'render options. Example available in documentation or check "config.js" file placed in module distr');

program.parse(process.argv);

// .option('--version <items>', 'Node.js version. By default it is "current". Also can be "latest", strict version like "7.10.0" or major version like "7" (it means latest 7.x). And of course you can list verions with commas like "current, 4, latest"', parseVersions)

// read custom config option
if (program.config) {
    try {
        const config = Object.assign({}, require(program.config));
        customConfig.docs = Object.assign({}, config.docs);
        customConfig.pdfGenerator = Object.assign({}, config.pdfGenerator);
    } catch (e) {
        console.error(`Error occurred while loading custom config file "${customConfig}"`, e);
    }
}

// prepare docs config
let docs;
switch (true) {
    // from args
    case versions.length > 0:
        docs = {};
        [...new Set(versions)].forEach(v => {
            docs[v] = {};
        });
        break;

    // from custom config
    case !!program.config:
        docs = customConfig.docs || {};
        break;

    // from default module config
    default:
        docs = defaultConfig.docs;
}

// prepare final config for pdf generator
const pdfGeneratorConfig = Object.assign({}, defaultConfig.pdfGenerator, customConfig.pdfGenerator);
// xvfb option
if (typeof program.useXvfb === 'boolean') {
    pdfGeneratorConfig.xvfb = program.useXvfb;
}
// out option
if (program.out) {
    pdfGeneratorConfig.out = program.out;
}

// pdf generator instance
const pdf = new PdfGenerator(pdfGeneratorConfig);

// final docs
const docsVersions = Object.keys(docs).filter(version => docs[version].enabled !== false);

// render tasks as Promise
const tasks = docsVersions.map(version => {
    const renderOptions = docs[version];
    return () => pdf.gen(version, renderOptions)
        .then(result => result)
        .catch(error => console.error(error));
});

if (tasks.length) {
    promiseSerial(tasks)
        .then(result => console.log(`All done:\n - ${result.join("\n - ")}`))
        .catch(error => console.error(error));
} else {
    console.log('Nothing to render.');
}
