'use strict';

const {Model} = require(`sequelize`);

module.exports = (sequelize) => {
  class ArticleCategory extends Model {}
  ArticleCategory.init({
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
  });

  return ArticleCategory;
};
