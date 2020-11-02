'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Auth extends Model {}
  Auth.init({
    [`is_auth`]: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
  });

  return Auth;
};
