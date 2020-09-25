'use strict';

const {CommandsNames} = require(`./constants.js`);

const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const {Pool} = require(`pg`);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});


module.exports = {
  name: CommandsNames.DB_CONNECT,
  run() {
    (async () => {
      try {
        logger.info(`Start connection to database...`);

        const client = await pool.connect();
        logger.info(`Database connection established.`);

        client.release();
        pool.end();
        logger.info(`Connection pool closed.`);

      } catch (err) {
        logger.error(`Can't connect to database. ${err}`);
      }
    })();
  }
};
