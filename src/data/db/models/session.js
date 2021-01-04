'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Session extends Model {}
  Session.init({
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expires: {
      type: DataTypes.DATE,
    },
    data: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: `createdAt`
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: `updatedAt`
    }
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
  });

  return Session;
};
