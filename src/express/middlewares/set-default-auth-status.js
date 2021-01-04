'use strict';

const {Empty} = require(`../../service/api/constants.js`);

module.exports = () => (
  async (req, res, next) => {

    if (!req.session[`auth`]) {
      req.session[`auth`] = Empty.AUTH;
    }

    next();
  }
);
