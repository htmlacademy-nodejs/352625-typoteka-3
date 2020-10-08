'use strict';

const {Sequelize} = require(`sequelize`);

require(`dotenv`).config();

const {getLogger} = require(`./../../../src/service/logger.js`);

const logger = getLogger();

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
const ArticleCategory = require(`./models/article-category.js`)(sequelize);

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
  through: `ArticleCategory`,
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
  through: `ArticleCategory`,
  timestamps: false,
});

const initDb = async (content) => {
  await sequelize.sync({force: true}); // TODO: delete {force: true} in production
  logger.info(`The database structure is created.`);

  await Avatar.bulkCreate(content.avatars);
  await Author.bulkCreate(content.authors);
  await Auth.bulkCreate(content.auths);
  await Article.bulkCreate(content.articles);
  await Comment.bulkCreate(content.comments);
  await Category.bulkCreate(content.categories);
  await ArticleCategory.bulkCreate(content.articlesCategories);

  // await initArticlesCategories(content.articlesCategories);
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
