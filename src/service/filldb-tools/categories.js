'use strict';

const {ADMIN_USER_ID} = require(`./constants.js`);

const getCategories = (categories) => categories
  .map((category) => ({
    [`name`]: category,
    [`author_id`]: ADMIN_USER_ID,
  }));

module.exports = getCategories;
