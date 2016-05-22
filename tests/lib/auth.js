'use strict';

const auth = requireTestSubject('lib/auth');

var should = require('should');
var redis = require('lib/redis');

describe('authorization module', function () {
  let originalRedis;
  beforeEach(function () {
    originalRedis = redis;

    redis = mocks.mockRedis(redis);
  });
  describe('generateUserName', function () {
    it('generates a random user name using a faker', function () {
      auth.generateUserName().should.be.a.String();
    });
  });
  describe('randomAuthorization', function () {
    it('generates a new authorization with a random user name', function () {
      var randomAuthorization = auth.randomAuthorization();
      randomAuthorization.should.have.property('token').which.is.a.String();
      randomAuthorization.should.have.property('userName').which.is.a.String();
    });
  });
  describe('getSetAuthorization', function () {
    it('retrives an authorization if it\s still valid', function (done) {
      redis.getReturn = 'recorded authorization token';
      auth.getSetAuthorization({token: 'provided authorization token'})
      .then(authorization => {
        authorization.should.be.deepEqual(
          {token: 'recorded authorization token'}
        );
        done();
      })
      .catch(err => {
        done(err);
      });
    });
    it(
      'return a new authorization if there is no recorded ' +
      'authorization for the provided token',
    function (done) {
      redis.getReturn = undefined;
      auth.getSetAuthorization(
        {token: 'provided authorization token'}
      )
      .then(newAuthorization => {
        newAuthorization.should.have.property('new').which.is.ok();
        newAuthorization.should.have.property('token').which.is.a.String();
        newAuthorization.should.have.property('userName').which.is.a.String();
        done();
      })
      .catch(err => {
        done(err);
      });
    });
    it('saves the new authorization', function () {
      redis.getReturn = undefined;
      auth.getSetAuthorization(
        {token: 'provided authorization token'}
      )
      .then(newAuthorization => {
        redis.setSpy.calledWith(
          'provided authorization token', newAuthorization.name
        ).to.be.ok();
        done();
      })
      .catch(err => {
        done(err);
      });
    });
    it('the authorization has a life of 10 minutes', function () {
      redis.getReturn = undefined;
      auth.getSetAuthorization(
        {token: 'provided authorization token'}
      )
      .then(newAuthorization => {
        redis.expireat.calledWith(
          'provided authorization token', newAuthorization.expireat
        ).to.be.ok();
        done();
      })
      .catch(err => done(err));
    });
  });
  describe('getTokenFromAuthorization', function () {
    it('transform an authorization object to a header token', function () {
      auth.getTokenFromAuthorization({token: 'abcdef'})
      .should.be.equal('Bearer abcdef');
    });
  });
  describe('getAuthorizationTokenFromHeader', function () {
    it('get the token from the header token', function () {
      auth.getAuthorizationTokenFromHeader('Bearer abcd')
      .should.be.equal('abcd');
    });
    it('is empty of there is no header', function () {
      should.not.exist(auth.getAuthorizationTokenFromHeader());
    });
  });
  afterEach(function () {
    redis = originalRedis;
  });
});
