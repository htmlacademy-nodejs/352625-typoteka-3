'use strict';

const {Sequelize} = require(`sequelize`);

require(`dotenv`).config();

const getDbConnection = (dbName) => {
  return new Sequelize(
      dbName,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
      }
  );
};

const createDb = async (dbName, mainOrm) => {
  await mainOrm.query(`DROP DATABASE IF EXISTS ${dbName}`);
  await mainOrm.query(`CREATE DATABASE ${dbName}`);
  await mainOrm.close();
};

module.exports = {getDbConnection, createDb};
