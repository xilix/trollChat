'use strict';

const thunkify = require('thunkify-wrap');
const redis = require('redis');
const config = require('../config/config');

const client = redis.createClient(config.redis);

process.on('SIGINT', () => client.quit());

module.exports = {
  hmget: thunkify(client.hmget).bind(client),
  hmset: client.hmset
};
