'use strict';

const PdfGenerator = require('./src/pdf-generator');

const config = require('./config');
const docs = config.docs;
const pdf = PdfGenerator.create(config.pdfGenerator);

// thx to https://hackernoon.com/functional-javascript-resolving-promises-sequentially-7aac18c4431e
const promiseSerial = funcs =>
    funcs.reduce(
        (promise, func) => promise.then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([])
    );

const tasks = Object.keys(docs).filter(version => docs[version].enabled !== false).map(version => {
    const renderOptions = docs[version];
    return () => pdf.gen(version, renderOptions)
        .then(result => result)
        .catch(error => console.error(error));
});

promiseSerial(tasks)
    .then(result => console.log(`All done:\n - ${result.join("\n - ")}`))
    .catch(console.error.bind(console));
