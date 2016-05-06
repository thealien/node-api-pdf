"use strict";
var async = require('async'),
    numeral = require('numeral'),
    util = require('util');

var config = require('./config'),
    PdfGenerator = require('./lib/pdf-generator'),
    pdf, docs, tasks;

docs = config.docs;
pdf = PdfGenerator.create(config.pdfGenerator);

tasks = Object.keys(docs).map(function (version) {
    var renderOptions = docs[version];

    return function (callback) {
        var startTime = Date.now();
        pdf.gen(version, renderOptions)
            .then(function (result) {
                console.log(util.format('PDF file created: %s | Time taken: %s', result, numeral((Date.now() - startTime)/1000).format('00:00')));
                callback();
            })
            .catch(function (error) {
                console.error(error);
                callback();
            });
    };

});

async.series(tasks);