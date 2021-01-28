'use strict';

module.exports = () => (
  async (req, res, next) => {

    if (req.session[`auth`][`status`]) {
      res.redirect(`/`);
    }

    next();
  }
);
