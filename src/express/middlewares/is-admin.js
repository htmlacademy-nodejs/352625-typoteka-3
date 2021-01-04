'use strict';

const {render404Page} = require(`../routes/render.js`);

module.exports = () => (
  async (req, res, next) => {

    if (req.session[`auth`][`user`] === null || req.session[`auth`][`user`][`is_admin`] === false) {
      render404Page(req, res);
      return;
    }
    req.body[`userId`] = req.session[`auth`][`user`][`id`];
    next();
  }
);
