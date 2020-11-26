'use strict';

const checkApiReply = require(`../middlewares/check-api-reply.js`);
const uploadFile = require(`../middlewares/upload-file.js`);
const saveFileNameToBody = require(`../middlewares/save-filename-to-request-body.js`);

module.exports = {
  checkApiReply,
  uploadFile,
  saveFileNameToBody,
};
