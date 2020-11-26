'use strict';

module.exports = (fileLabel) => (
  (req, res, next) => {
    const {body, file} = req;

    if (file) {
      body[`${fileLabel}`] = file.filename;
    }

    next();
  }
);
