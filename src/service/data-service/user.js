'use strict';

const {db} = require(`./../../data/db/db.js`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;

class UserService {
  constructor(database = db) {
    this._database = database;
  }

  async findByEmail(email) {
    return await this._database.Author.findOne({where: {email}});
  }

  async getExistingEmail(email) {
    let existingEmail = null;
    const user = await this.findByEmail(email);

    if (user) {
      existingEmail = email;
    }
    return existingEmail;
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

    await this._database.Avatar.create({
      regular: formData[`avatar`] === `` ? null : formData[`avatar`],
      small: formData[`avatar`] === `` ? null : formData[`avatar`],
      [`author_id`]: user[`id`],
    });

    return user;
  }

  async checkUser(user, formData) {
    const match = await bcrypt.compare(formData[`password`], user[`password`]);

    if (match) {
      await this._database.Auth.update({[`is_auth`]: false}, {where: {[`is_auth`]: true}});

      const auth = await this._database.Auth.findOne(
          {
            where: {
              [`author_id`]: user[`id`]
            }
          }
      );
      auth[`is_auth`] = true;
      await auth.save();
    }

    return match;
  }

  async logout() {
    await this._database.Auth.update({[`is_auth`]: false}, {where: {[`is_auth`]: true}});
  }
}

module.exports = UserService;
