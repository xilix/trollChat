'use strict';

const hat = require('hat');
const faker = require('faker');
const redis = require('./redis');
const co = require('co');

const authModule = {
  generateUserName: function () {
    return faker.name.findName();
  },
  randomAuthorization: function () {
    return {
      token: hat(),
      userName: faker.name.findName()
    };
  },
  getSetAuthorization: function (auth) {
    return co(function* () {
      if (
        !auth || !auth.token || !(auth.token = yield redis.get(auth.token))
      ) {
        auth = authModule.randomAuthorization();
        auth.new = true;
        auth.expireAt = 600;
        redis.expireat(auth.token, 600);
        redis.set(auth.token, auth.userName);
      }

      return auth;
    });
  },
  getAuthroizationUsername: function (authorization) {
    if (authorization) {
      return co(function* () {
        if (authorization) {
          return yield redis.get(authorization);
        }
      });
    }
    return Promise.resolve();
  },
  getAuthorizationTokenFromHeader: function (header) {
    if (header) {
      return String(header).replace('Bearer ', '');
    }
  },
  getTokenFromAuthorization: function (authorization) {
    return 'Bearer ' + authorization.token;
  },
  socketMiddleware: function (socket, next) {
    authModule.middleWare(null, socket.req, {}, next);
  },
  middleWare: function (req, res, next) {
    authModule.getSetAuthorization({
      token: authModule.getAuthorizationTokenFromHeader(
        req.header('Authorization')
      )
    })
    .then((authorization) => {
      res.locals.authorization = authorization;
      res.set(
        'Authorization',
        authModule.getTokenFromAuthorization(authorization)
      );
      next();
    })
    .catch(err => next(err));
  }
};

module.exports = authModule;
