'use strict';

require(`dotenv`).config();

const {getDbConnection, createDb} = require(`../utils.js`);
const initModels = require(`../models`);
const {getLogger} = require(`./../../../service/logger.js`);

const logger = getLogger();

const FAKE_DB_NAME = `fake_typoteka`;

const sequelize = getDbConnection(`postgres`);
const fakeSequelize = getDbConnection(FAKE_DB_NAME);

const {
  Avatar,
  Author,
  Article,
  Comment,
  Category,
  ArticleCategory,
} = initModels(fakeSequelize);


const initDb = async (content, orm) => {
  try {
    await createDb(FAKE_DB_NAME, sequelize);
    logger.info(`The database ${FAKE_DB_NAME} is created.`);

    await orm.sync({force: true});
    logger.info(`The database structure is created.`);

    await Author.bulkCreate(content.authors);
    await Avatar.bulkCreate(content.avatars);
    await Article.bulkCreate(content.articles);
    await Comment.bulkCreate(content.comments);
    await Category.bulkCreate(content.categories);
    await ArticleCategory.bulkCreate(content.articlesCategories);

    logger.info(`The database is filled with mocks.`);
  } catch (error) {
    logger.error(`Something is going wrong: ${error}`);
  }
};

const initEmptyDb = async (orm) => {
  try {
    await createDb(FAKE_DB_NAME, sequelize);
    logger.info(`The database ${FAKE_DB_NAME} is created.`);

    await orm.sync({force: true});
    logger.info(`The database structure is created.`);

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
    Article,
    Comment,
    Category,
  },
  initDb,
  initEmptyDb,
  dropDb,
  fakeSequelize,
};
