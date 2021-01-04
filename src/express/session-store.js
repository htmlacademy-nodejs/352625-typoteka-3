'use strict';

const Sequelize = require(`sequelize`);
const sessionStore = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(sessionStore.Store);
require(`dotenv`).config();

const Expiration = {
  PERIOD: 180000, // 3 min
  CHECK: 60000, // 1 min
};

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
    }
);

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: Expiration.PERIOD,
  checkExpirationInterval: Expiration.CHECK,
  tableName: `sessions`,
});

const sessionMiddleware = sessionStore({
  secret: process.env.SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
  name: `session_id`,
});


module.exports = sessionMiddleware;
