/* eslint-disable */

'use strict';

// Browser ES6 Polyfill
require('babel/polyfill');

var context = require.context('./_test_/spec', true, /\.test\.jsx$|\.test\.js$/);
context.keys().forEach(context);
