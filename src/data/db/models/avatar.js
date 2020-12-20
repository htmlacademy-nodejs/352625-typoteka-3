'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Avatar extends Model {}
  Avatar.init({
    [`id`]: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    [`regular`]: {
      type: DataTypes.STRING,
    },
    [`small`]: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
  });

  return Avatar;
};
