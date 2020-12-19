'use strict';

module.exports = () => (
  async (req, res, next) => {
    let categoryId = null;

    if (req.query.id) {
      categoryId = JSON.parse(req.query.id);
    }
    req.categoryId = categoryId;
    next();
  }
);
