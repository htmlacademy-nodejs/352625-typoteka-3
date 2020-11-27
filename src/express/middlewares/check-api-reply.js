'use strict';

const {HttpCode} = require(`../../service/cli/constants.js`);

module.exports = () => (
  async (req, res, next) => {
    let status = HttpCode.OK;
    let data = null;
    let errors = null;

    if (req.query.data) {
      const apiReply = JSON.parse(req.query.data);
      status = apiReply.status;
      data = apiReply.data;
      errors = apiReply.errors;
    }

    req.apiStatus = status;
    req.apiData = data;
    req.apiErrors = errors;

    next();
  }
);
