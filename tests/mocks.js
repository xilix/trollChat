'use strict';

const sinon = require('sinon');
const redis = require('redis');

module.exports = {
  mockRedis: function (redis) {
    redis.hmgetSpy = sinon.spy();
    redis.hmget = function (hash, key) {
      redis.hmgetSpy(hash, key);
      return function thunk(cb) {
        cb(null, redis.hmgetReturn);
      };
    };
    redis.hmset = sinon.spy();
    redis.del = sinon.spy();

    return redis;
  },
  mockFs: function (fs) {
    fs.readFileSpy = sinon.spy();
    fs.readFile = function (fileName) {
      fs.readFileSpy(fileName);
      return function thunk(cb) {
        cb(null, fs.readFileReturn);
      };
    };
    fs.statSpy = sinon.spy();
    fs.stat = function (fileName) {
      fs.statSpy(fileName);
      return function thunk(cb) {
        cb(null, fs.statReturn);
      };
    };

    return fs;
  }
};
