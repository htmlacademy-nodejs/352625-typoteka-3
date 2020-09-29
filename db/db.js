'use strict';

const {Sequelize, Op} = require(`sequelize`);

require(`dotenv`).config();

const {getLogger} = require(`./../src/service/logger.js`);

const logger = getLogger();

const {
  avatars,
  authors,
  articles,
  comments,
  categories,
  article_category
} = require(`./mocks.js`);

const {
  getArticlesIds,
  getCategories,
} = require(`./utils.js`);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const Avatar = require(`./models/avatar.js`)(sequelize);
const Author = require(`./models/author.js`)(sequelize);
const Article = require(`./models/article.js`)(sequelize);
const Comment = require(`./models/comment.js`)(sequelize);
const Category = require(`./models/category.js`)(sequelize);

Avatar.hasOne(Author, {
  foreignKey: `avatar_id`,
});

Author.hasMany(Article, {
  foreignKey: `author_id`,
});

Author.hasMany(Comment, {
  foreignKey: `author_id`,
});

Article.belongsTo(Author, {
  foreignKey: `author_id`,
});

Article.hasMany(Comment, {
  foreignKey: `article_id`,
});

Article.belongsToMany(Category, {
  as: `categories`,
  foreignKey: `article_id`,
  through: `article_category`,
  timestamps: false,
});

Comment.belongsTo(Author, {
  foreignKey: `author_id`,
});

Comment.belongsTo(Article, {
  foreignKey: `article_id`,
});

Category.belongsToMany(Article, {
  as: `articles`,
  foreignKey: `category_id`,
  through: `article_category`,
  timestamps: false,
});

const initArticlesCategories = async (list) => {
  const articlesIds = getArticlesIds(list);

  for (const id of articlesIds) {
    const categories = getCategories(list, id);
    const article = await Article.findByPk(id);

    await article.addCategories(categories);
  }
};

const initDb = async () => {
  await sequelize.sync({force: true}); // TODO: delete {force: true} in production
  logger.info(`The database structure is created.`);

  await Avatar.bulkCreate(avatars);
  await Author.bulkCreate(authors);
  await Article.bulkCreate(articles);
  await Comment.bulkCreate(comments);
  await Category.bulkCreate(categories);

  await initArticlesCategories(article_category);
  logger.info(`The database is filled with mocks.`);
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
