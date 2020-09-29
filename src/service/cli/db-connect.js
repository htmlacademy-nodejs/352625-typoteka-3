'use strict';

const {CommandsNames} = require(`./constants.js`);

const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const Sequelize = require(`sequelize`);

require(`dotenv`).config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
    }
);


module.exports = {
  name: CommandsNames.DB_CONNECT,
  run() {
    (async () => {
      try {
        logger.info(`Start connection to database...`);

        await sequelize.authenticate();
        logger.info(`Database connection established.`);
      } catch (err) {
        logger.error(`Can't connect to database. ${err}`);
      }
    })();
  }
};
