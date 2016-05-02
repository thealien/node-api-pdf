"use strict";

var config = require('./config'),
    pdfGenerator = require('./lib/pdf-generator').create(config.pdfGenerator),
    docs = config.docs;

Object.keys(docs).forEach(function (version) {
    pdfGenerator.gen(version, docs[version]);
});