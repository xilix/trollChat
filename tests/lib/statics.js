'use strict';

const statics = require('lib/statics');

var should = require('should');
var redis = require('lib/redis');
var fs = require('lib/fs');

describe('statics module', function () {
  let originalRedis;
  let originalFs;
  beforeEach(function () {
    originalRedis = redis;
    originalFs = fs;

    redis = mocks.mockRedis(redis);
    fs = mocks.mockFs(fs);
  });
  describe('get', function () {
    it('load content from memory if is already recorded', function (done) {
      redis.hmgetReturn = 'memory value';
      statics.get('src/index.html').then((value) => {
        redis.hmgetSpy.calledWith('statics', 'src/index.html').should.be.ok();
        value.should.be.equal('memory value');
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
    it('load content from file if isn\'t recorded', function (done) {
      redis.hmgetReturn = null;
      fs.statReturn = true;
      fs.readFileReturn = 'file data';
      statics.get('src/index.html').then((value) => {
        redis.hmgetSpy.calledWith('statics', 'src/index.html').should.be.ok();
        fs.statSpy.calledWith('src/index.html').should.be.ok();
        fs.readFileSpy.calledWith('src/index.html').should.be.ok();
        value.should.be.equal('file data');
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
    it('sets redis memory when a value is not recorded', function (done) {
      redis.hmgetReturn = null;
      fs.statReturn = true;
      fs.readFileReturn = 'file data';
      statics.get('src/index.html').then((value) => {
        redis.hmset.calledWith(
          'statics', 'src/index.html', 'file data'
        ).should.be.ok();
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
    it('returns undefined if there is no file and memory', function (done) {
      redis.hmgetReturn = null;
      fs.statReturn = false;
      statics.get('src/index.html').then((value) => {
        should.not.exists(value);
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
  });
  afterEach(function () {
    redis = originalRedis;
    fs = originalFs;
  });
});
