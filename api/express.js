'use strict';

const express = require('express');
const app = require('server');
const statics = require('lib/statics');
const sockets = require('lib/socket');
const auth = require('lib/auth');

statics.reset();

app.use('/static', express.static('./public'));

app.use('/auth', auth.middleWare);
app.get('/auth', function (req, res, next) {
  res.send({
    t: res.locals.authorization.token,
    u: res.locals.authorization.userName,
    e: res.locals.authorization.expireAt
  });
});

app.get('/', function (req, res, next) {
  // TODO: In angular endpoint
  var content = [
    '<ul>',
      sockets.getChannelsName().map(
        channelName => '<li>' + channelName + '</li>'
      ).join(''),
    '</ul>'
  ].join('\r');
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(content);
});

app.get('/:channel', function (req, res, next) {
  sockets.connect(req.params.channel);

  statics.get('./public/index.htm')
  .then(content => {
    // TODO: In angular endpoint
    content = (content || '').toString()
              .replace('{{channel}}', req.params.channel);
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Content-Length', Buffer.byteLength(content));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(content);
  })
  .catch(err => next(err));
});

app.listen(8080, function () {
  console.log('Listen on port 8080');
});

