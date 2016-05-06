"use strict";
var async = require('async'),
    util = require('util');

var config = require('./config'),
    PdfGenerator = require('./lib/pdf-generator'),
    pdf, docs, tasks;

docs = config.docs;
pdf = PdfGenerator.create(config.pdfGenerator);

tasks = Object.keys(docs).map(function (version) {
    var renderOptions = docs[version];

    return function (callback) {

        pdf.gen(version, renderOptions)
            .then(function (result) {
                console.log(util.format('Success: %s', result));
                callback();
            })
            .catch(function (error) {
                console.error(error);
                callback();
            });
    };

});

async.series(tasks);