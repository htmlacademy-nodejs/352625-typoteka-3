'use strict';

const uploadFile = require(`../middlewares/upload-file.js`);
const saveFileNameToBody = require(`../middlewares/save-filename-to-request-body.js`);
const isAdmin = require(`../middlewares/is-admin.js`);
const isUser = require(`../middlewares/is-user.js`);
const setDefaultAuthStatus = require(`../middlewares/set-default-auth-status.js`);
const isLoggedIn = require(`../middlewares/is-already-logged-in.js`);

module.exports = {
  uploadFile,
  saveFileNameToBody,
  isAdmin,
  isUser,
  setDefaultAuthStatus,
  isLoggedIn,
};
