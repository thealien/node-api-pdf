"use strict";

var _010_012 = {
    hide: [
        '#nav',
        '#footer',
        '#column2'
    ],

    style: {
        "#column1": {
            width: '880px'
        },
        '#content-wrap': {
            padding: '0'
        },
        'body': {
            background: 'white'
        }
    }
};

var _4_5_6 = {
    hide: [
        '#gtoc',
        '#column2'
    ],
    style: {
        html: {
            height: 'auto'
        },
        body: {
            height: 'auto'
        },
        "#column1": {
            margin: 0
        }
    }
};

module.exports = {

    'latest-v0.10.x': {
        hide: _010_012.hide,
        style: _010_012.style
    },

    'latest-v0.12.x': {
        hide: _010_012.hide,
        style: _010_012.style
    },

    'latest-v4.x': {
        hide: _4_5_6.hide,
        style: _4_5_6.style
    },

    'latest-v5.x': {
        hide: _4_5_6.hide,
        style: _4_5_6.style
    },

    'latest-v6.x': {
        hide: _4_5_6.hide,
        style: _4_5_6.style
    }
};