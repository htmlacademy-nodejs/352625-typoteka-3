'use strict';

const express = require(`express`);
const pino = require(`pino`)(`./src/service/logs/service.log`);
const expressPino = require(`express-pino-logger`)({
  logger: pino
});

const {
  CommandsNames,
  DEFAULT_API_PORT,
} = require(`./constants.js`);

const routes = require(`./../api`);

const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const app = express();

app.use(express.json());

app.use(routes);

app.set(`json spaces`, 2);

app.use((req, res) => {
  res.status(404).send(`Page not exists`);
  logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);
});

app.use(expressPino);

module.exports = {
  app,
  name: CommandsNames.SERVER,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_API_PORT;

    app.listen(
        port,
        () => logger.info(`Server start on ${port}`))
      .on(`error`, (err) => {
        logger.error(`Server can't start. Error: ${err}`);
      });
  }
};
