'use strict';

const sinon = require('sinon');
const redisRaw = require('redis');

var mocks = {
  mockRedis: function (redis) {
    redis.getSpy = sinon.spy();
    redis.get = function (hash, key) {
      redis.getSpy(hash, key);
      return function thunk(cb) {
        cb(null, redis.getReturn);
      };
    };
    redis.hmgetSpy = sinon.spy();
    redis.hmget = function (hash, key) {
      redis.hmgetSpy(hash, key);
      return function thunk(cb) {
        cb(null, [redis.hmgetReturn]);
      };
    };
    redis.set = sinon.spy();
    redis.hmset = sinon.spy();
    redis.del = sinon.spy();
    redis.expireat = sinon.spy();

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

module.exports = mocks;
