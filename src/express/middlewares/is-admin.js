'use strict';

const {render404Page} = require(`../routes/render.js`);

module.exports = () => (
  async (req, res, next) => {

    if (res.auth.user[`is_admin`] === false) {
      render404Page(req, res);
      return;
    }

    next();
  }
);
