'use strict';

const app = require('server');
const authModule = require('lib/auth');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const uo = require('uo.js');
const logger = require('lib/logger');

http.listen(
  3000, () => console.log('socket server listening on *:3000')
);

var channels = {};
var channelsName = [];

module.exports = {
  getChannelsName: function () {
    return channelsName;
  },
  connect: function (channel) {
    if (!channels[channel]) {
      logger.log('Open channel' + channel);
      channelsName = Object.keys(channels);

      channels[channel] = io.of(channel);
      channels[channel].on('connection', function (socket) {
        logger.log('User connect');

        // TODO: implment login before joining to channel
        channels[channel].emit(
          'join',
          {
            u: 'unknown'
          }
        );

        socket.on('push', function (message) {
          logger.log('push message');
          logger.log(message);
          if (message && message.m) {
            authModule
            .getAuthroizationUsername(message.t)
            .then(userName => {
              if (userName) {
                channels[channel].emit(
                  'notify',
                  {
                    u: userName,
                    m: message.m
                  }
                );
              }
            });
          }
        });
      });
      channels[channel].on(
        'disconnect',
        function () {
          if (!channels[channel].engine.clientsCount) {
            console.log('Close channel' + channel);
            channelsName = Object.keys(channels);

            channels[channel] = undefined;
            delete channels[channel];
          }
        }
      );
    }
  }
};

