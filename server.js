'use strict';

const express = require('express');
const app = express();

process.on('SIGINT', () => {
  process.emit('cleanup');
  process.exit(2);
});
process.on('exit', function () {
  process.emit('cleanup');
});

module.exports = app;

