'use strict';

const {db} = require(`./../../data/db/db.js`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;

class UserService {
  constructor(database = db) {
    this._database = database;
  }

  async findOneByEmail(email) {
    return await this._database.Author.findOne({where: {email}});
  }

  async add(formData) {
    const user = await this._database.Author.create({
      firstname: formData[`firstname`],
      lastname: formData[`lastname`],
      email: formData[`email`],
      password: await bcrypt.hash(formData[`password`], saltRounds),
      [`is_admin`]: false,
    });

    await this._database.Auth.create({
      [`is_auth`]: false,
      [`author_id`]: user[`id`],
    });

    if (formData[`avatar`] !== ``) {
      await this._database.Avatar.create({
        regular: formData[`avatar`],
        small: formData[`avatar`],
        [`author_id`]: user[`id`],
      });
    }

    return user;
  }
}

module.exports = UserService;
