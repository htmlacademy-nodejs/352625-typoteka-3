'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Auth extends Model{}
  Auth.init({
  is_auth: {
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

// TODO Не смог реализовать наличия всех 'is_auth' = false, либо не более одного одного 'is_auth' = true;
// CREATE TABLE auths
// (
//   author_id INTEGER NOT NULL,
//   is_auth BOOLEAN DEFAULT FALSE,
//   FOREIGN KEY (author_id) REFERENCES authors (id)
//     ON DELETE CASCADE
//     ON UPDATE CASCADE,
//   EXCLUDE (is_auth WITH =) WHERE (is_auth)
// );
