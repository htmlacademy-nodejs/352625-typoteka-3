'use strict';

require(`dotenv`).config();

const {getDbConnection} = require(`./utils.js`);
const initModels = require(`./models`);
const {getLogger} = require(`./../../../src/service/logger.js`);

const logger = getLogger();

const sequelize = getDbConnection(process.env.DB_NAME);

const {
  Avatar,
  Author,
  Article,
  Comment,
  Category,
  ArticleCategory,
} = initModels(sequelize);

const initDb = async (content, orm) => {
  try {
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

module.exports = {
  db: {
    Avatar,
    Author,
    Article,
    Comment,
    Category,
  },
  initDb,
  sequelize,
};
