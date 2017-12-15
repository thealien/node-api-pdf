'use strict';

const loader = require('configaro').create(__dirname);
exports.docs = loader.load('docs');
exports.pdfGenerator = loader.load('pdf-generator');
