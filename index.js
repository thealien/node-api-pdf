'use strict';

const defaultConfig = require('./config.js');
const defaultDocs = defaultConfig.docs;
const defaultPdfGenerator = defaultConfig.pdfGenerator;

const PdfGenerator = require('./src/pdf-generator');
const promiseSerial = require('./src/promise-serial');

//////////////////////////
// handle args and options
//////////////////////////
const program = require('commander');
let versions = ['current'],
    customConfig = {};

program
    .arguments('[versions...]', 'Node.js version. By default it is "current". Also can be "latest", strict version like "7.10.0" or major version like "7" (it means latest 7.x). And of course you can list verions with commas like "current, 4, latest"')
    .action(argVersions => {
        if (argVersions.length) {
            versions = argVersions.map(v => v.trim()).filter(v => v.length);
        }
    })
    // .option('--version <items>', 'Node.js version. By default it is "current". Also can be "latest", strict version like "7.10.0" or major version like "7" (it means latest 7.x). And of course you can list verions with commas like "current, 4, latest"', parseVersions)
    .option('-o, --output', 'Output directory (if no configured CWD will be used)')
    .option('-x, --use-xvfb', 'Use it if run on system without a graphical environment. Please install "xvfb" before (like "sudo apt-get install xvfb" or equivalent)')
    .option('-c, --config <customConfigFile>', 'Custom config file (js/json) where listed Node.js versions and render options. Example available in documentation or check "config.js" file placed in module distr')
    .parse(process.argv);

// read custom config option
if (program.config) {
    try {
        customConfig = Object.assign({}, require(program.config));
    } catch (e) {
        console.error(`Error occurred while loading custom config file "${customConfig}"`, e);
    }
}

// prepare docs config

let docs;
if (versions.length) {
    docs = {};
    [...new Set(versions)].forEach(v => {
        docs[v] = {};
    });
} else if (customConfig) {
    docs = Object.assign({}, customConfig.docs);
} else {
    docs = defaultDocs;
}

// read xvfb option
const useXvfb = program.useXvfb;

// read out option
const customOut = program.out;

const pdfGeneratorConfig = Object.assign({}, customConfig.pdfGenerator, defaultPdfGenerator);
if (typeof useXvfb === 'boolean') {
    pdfGeneratorConfig.xvfb = useXvfb;
}
if (customOut) {
    pdfGeneratorConfig.out = customOut;
}

const pdf = PdfGenerator.create(pdfGeneratorConfig);

const docsToRender = Object.keys(docs).filter(version => docs[version].enabled !== false);

const tasks = docsToRender.map(version => {
    const renderOptions = docs[version] || {};
    const vname = renderOptions.name || version;
    return () => pdf.gen(vname, renderOptions)
        .then(result => result)
        .catch(error => console.error(error));
}).filter(task => task);

if (tasks.length) {
    promiseSerial(tasks)
        .then(result => console.log(`All done:\n - ${result.join("\n - ")}`))
        .catch(error => console.error(error));
} else {
    console.log('Nothing to render.');
}
