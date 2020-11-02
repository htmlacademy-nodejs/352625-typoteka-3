'use strict';

const {db} = require(`./../../data/db/db.js`);


class AuthService {
  constructor(database = db) {
    this._database = database;
  }

  async get() {
    const authData = await this._database.Auth.findOne({
      where: {
        [`is_auth`]: true
      },
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

    let result = {
      status: false,
      user: null,
    };

    if (authData) {
      result = {
        status: authData[`is_auth`],
        user: authData[`user`],
      };
    }

    return result;
  }
}

module.exports = AuthService;
