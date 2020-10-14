'use strict';

const {Sequelize} = require(`sequelize`);

require(`dotenv`).config();

const initModels = require(`../models`);

const {getLogger} = require(`./../../../service/logger.js`);

const logger = getLogger();

const FAKE_DB_NAME = `fake_typoteka`;

const fakeSequelize = new Sequelize(
    FAKE_DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
    }
);

const {
  Avatar,
  Author,
  Auth,
  Article,
  Comment,
  Category,
  ArticleCategory,
} = initModels(fakeSequelize);

const initDb = async (content, orm) => {
  try {
    // TODO если базы 'fake_typoteka' не существует, то ее нужно создать вручную, чтобы тесты заработали
    await orm.sync({force: true});
    logger.info(`The database structure is created.`);

    await Author.bulkCreate(content.authors);
    await Avatar.bulkCreate(content.avatars);
    await Auth.bulkCreate(content.auths);
    await Article.bulkCreate(content.articles);
    await Comment.bulkCreate(content.comments);
    await Category.bulkCreate(content.categories);
    await ArticleCategory.bulkCreate(content.articlesCategories);

    logger.info(`The database is filled with mocks.`);
  } catch (error) {
    logger.error(`Something is going wrong: ${error}`);
  }
};

const dropDb = async (orm) => {
  try {
    await orm.drop();

    logger.info(`All db tables are dropped.`);
  } catch (error) {
    logger.error(`Something is going wrong: ${error}`);
  }
};

module.exports = {
  fakeDb: {
    Avatar,
    Author,
    Auth,
    Article,
    Comment,
    Category,
  },
  initDb,
  dropDb,
  fakeSequelize,
};
