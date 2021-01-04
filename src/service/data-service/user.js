'use strict';

const {db} = require(`./../../data/db/db.js`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;

class UserService {
  constructor(database = db) {
    this._database = database;
  }

  async findOne(id) {
    return await this._database.Author.findByPk(id);
  }

  async isAdmin(userId) {
    const admin = await this._database.Author.findOne({
      where: {
        [`is_admin`]: true
      },
      attributes: [`id`],
    });

    return admin[`id`] === userId;
  }

  async isUser(userId) {
    const user = await this._database.Author.findByPk(userId);
    return !!user;
  }

  async findByEmail(email) {
    return await this._database.Author.findOne({where: {email}, attributes: [`id`, `email`, `password`]});
  }

  async getAuth(email) {
    return {
      status: true,
      user: await this._database.Author.findOne({
        where: {
          email
        },
        attributes: [`id`, `firstname`, `lastname`, `is_admin`],

        include: {
          model: this._database.Avatar,
          as: `avatar`,
          attributes: [`regular`, `small`],
        }
      })
    };
  }

  async getExistingEmail(email) {
    let existingEmail = null;
    const user = await this.findByEmail(email);

    if (user) {
      existingEmail = email;
    }
    return existingEmail;
  }

  async add({firstname, lastname, email, password, avatar}) {
    const user = await this._database.Author.create({
      firstname,
      lastname,
      email,
      [`password`]: await bcrypt.hash(password, saltRounds),
      [`is_admin`]: false,
    });

    await this._database.Avatar.create({
      regular: avatar === `` ? null : avatar,
      small: avatar === `` ? null : avatar,
      [`author_id`]: user[`id`],
    });

    return user;
  }

  async checkUser(user, formData) {
    return await bcrypt.compare(formData[`password`], user[`password`]);
  }

}

module.exports = UserService;
