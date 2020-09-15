'use strict';

const getCategories = (categories) => categories
  .map((category, index) => ([index + 1, ` '${category}'`]));

module.exports = getCategories;
