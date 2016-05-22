'use strict';

const thunkify = require('thunkify-wrap');
const redis = require('redis');
const config = require('config/config');

const client = redis.createClient(config.redis);

process.on('cleanup', () => client.quit());

module.exports = {
  expireat: client.expireat.bind(client),
  get: thunkify(client.get).bind(client),
  set: thunkify(client.set).bind(client),
  del: client.del.bind(client),
  hmget: thunkify(client.hmget).bind(client),
  hmset: client.hmset.bind(client)
};
