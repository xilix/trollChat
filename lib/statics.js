'use strict';

const co = require('co');
const redis = require('lib/redis');
const fs = require('lib/fs');

module.exports = {
  /**
   * reset static files cache
   */
  reset: () => redis.del('statics'),

  /**
   * Singleton for static files.
   */
  get: function (filePath) {
    return co(function* () {
      let redisMemory = yield redis.hmget('statics', filePath);
      if (redisMemory && redisMemory[0]) {
        return redisMemory[0];
      } else if (yield fs.stat(filePath)) {
        let fileContent = yield fs.readFile(filePath);
        redis.hmset('statics', filePath, fileContent);
        return fileContent;
      } else {
        return;
      }
    });
  }
};
