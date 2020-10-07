'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Author extends Model {}
  Author.init({
    [`id`]: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    [`firstname`]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    [`lastname`]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    [`email`]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    [`password`]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
  });

  return Author;
};
