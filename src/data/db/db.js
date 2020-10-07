'use strict';

const {Sequelize} = require(`sequelize`);

require(`dotenv`).config();

const {getLogger} = require(`./../../../src/service/logger.js`);

const logger = getLogger();

const {
  avatars,
  authors,
  auths,
  articles,
  comments,
  categories,
  articleCategory
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
const Auth = require(`./models/auth.js`)(sequelize);
const Article = require(`./models/article.js`)(sequelize);
const Comment = require(`./models/comment.js`)(sequelize);
const Category = require(`./models/category.js`)(sequelize);

Author.belongsTo(Avatar, {
  foreignKey: `avatar_id`,
  as: `avatar`,
});

Author.hasMany(Article, {
  foreignKey: `author_id`,
});

Author.hasMany(Comment, {
  foreignKey: `author_id`,
});

Auth.belongsTo(Author, {
  foreignKey: `author_id`,
  as: `user`,
});

Article.belongsTo(Author, {
  foreignKey: `author_id`,
  as: `author`,
});

Article.hasMany(Comment, {
  foreignKey: `article_id`,
  as: `comments`,
});

Article.belongsToMany(Category, {
  as: `categories`,
  foreignKey: `article_id`,
  through: `article_category`,
  timestamps: false,
});

Comment.belongsTo(Author, {
  foreignKey: `author_id`,
  as: `author`,
});

Comment.belongsTo(Article, {
  foreignKey: `article_id`,
  as: `article`,
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
    const categoriesList = getCategories(list, id);
    const article = await Article.findByPk(id);

    await article.addCategories(categoriesList);
  }
};

const initDb = async () => {
  await sequelize.sync({force: true}); // TODO: delete {force: true} in production
  logger.info(`The database structure is created.`);

  await Avatar.bulkCreate(avatars);
  await Author.bulkCreate(authors);
  await Auth.bulkCreate(auths);
  await Article.bulkCreate(articles);
  await Comment.bulkCreate(comments);
  await Category.bulkCreate(categories);

  await initArticlesCategories(articleCategory);
  logger.info(`The database is filled with mocks.`);
};

module.exports = {
  db: {
    Avatar,
    Author,
    Auth,
    Article,
    Comment,
    Category,
  },
  initDb,
  sequelize,
};
