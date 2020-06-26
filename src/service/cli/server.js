'use strict';

const express = require(`express`);

const pino = require(`pino`)(`./logs/service.log`);
const expressPino = require(`express-pino-logger`)({
  logger: pino
});


const {
  CommandsNames,
  DEFAULT_API_PORT,
} = require(`./constants.js`);

const {PathName} = require(`./../routes/constants.js`);

const articlesRouter = require(`./../routes/articles.js`);
const categoriesRouter = require(`./../routes/categories.js`);
const searchRouter = require(`./../routes/search.js`);

const {getLogger} = require(`./../logger.js`);

const logger = getLogger();

const app = express();

app.use(`/${PathName.ARTICLES}`, articlesRouter);
app.use(`/${PathName.CATEGORIES}`, categoriesRouter);
app.use(`/${PathName.SEARCH}`, searchRouter);

app.use(express.json());

app.set(`json spaces`, 2);

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
