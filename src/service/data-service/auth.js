'use strict';

const {db} = require(`./../../data/db/db.js`);
const {Empty} = require(`../api/constants.js`);


class AuthService {
  constructor(database = db) {
    this._database = database;
  }

  async get() {
    let result = await this._database.Auth.findOne({
      where: {
        [`is_auth`]: true
      },
      attributes: [[`is_auth`, `status`]],
      include: {
        model: this._database.Author,
        as: `user`,
        attributes: [`id`, `firstname`, `lastname`],

        include: {
          model: this._database.Avatar,
          as: `avatar`,
          attributes: [`regular`, `small`],
        }
      }
    });

    if (!result) {
      result = Empty.AUTH;
    }

    return result;
  }
}

module.exports = AuthService;
