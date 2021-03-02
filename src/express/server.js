'use strict';

const express = require(`express`);
const http = require(`http`);
const socketIO = require(`socket.io`);

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const EventNames = {
  CONNECTION: `connection`,
  DISCONNECT: `disconnect`,
  COMMENT_ADD: `comment:add`,
};

io.on(EventNames.CONNECTION, (socket) => {
  console.log(`a user connected`);

  socket.on(EventNames.DISCONNECT, () => {
    console.log(`user disconnected`);
  });

  socket.on(EventNames.COMMENT_ADD, (data) => {
    io.broadcast.emit(EventNames.COMMENT_ADD, data);
  });
});

module.exports = {express, app, server, io, EventNames};
