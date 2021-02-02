'use strict';

const {Sequelize} = require(`sequelize`);

require(`dotenv`).config();

const getDbConnection = (dbName) => {
  return new Sequelize(
      dbName,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        logging: false,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
      }
  );
};

const createDb = async (dbName, mainOrm) => {
  await mainOrm.query(`DROP DATABASE IF EXISTS ${dbName}`);
  await mainOrm.query(`CREATE DATABASE ${dbName} WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'ru_RU.UTF-8' LC_CTYPE = 'ru_RU.UTF-8' TEMPLATE template0;`);
  await mainOrm.close();
};

module.exports = {getDbConnection, createDb};
