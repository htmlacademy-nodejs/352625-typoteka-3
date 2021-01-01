'use strict';

module.exports = () => (
  async (req, res, next) => {

    if (req.session[`auth`][`user`] === null) {
      res.redirect(`/login`);
      return;
    }
    req.body[`userId`] = req.session[`auth`][`user`][`id`];

    next();
  }
);
