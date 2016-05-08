'use strict';

global.mocks = require('./mocks');

global.requireTestSubject = function (path) {
  return require('../' + path);
};

describe('test suite', function () {
  require('./lib/statics');
});
