'use strict';

const fs = require('fs');
const co = require('co');
const thunkify = require('thunkify-wrap');

module.exports = {
  readFile: thunkify(fs.readFile).bind(fs),
  stat: thunkify(fs.stat).bind(fs)
}
