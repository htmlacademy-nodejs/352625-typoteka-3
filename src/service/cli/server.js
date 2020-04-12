'use strict';

const chalk = require(`chalk`);

const express = require(`express`);

const {
  CommandsNames,
  DEFAULT_PORT,
} = require(`./constants.js`);

const {PathName} = require(`./../routes/constants.js`);

const articlesRouter = require(`./../routes/articles.js`);
const categoriesRouter = require(`./../routes/categories.js`);
const searchRouter = require(`./../routes/search.js`);

const app = express();

app.use(`/${PathName.ARTICLES}`, articlesRouter);
app.use(`/${PathName.CATEGORIES}`, categoriesRouter);
app.use(`/${PathName.SEARCH}`, searchRouter);

app.use(express.json());

app.set(`json spaces`, 2);

module.exports = {
  app,
  name: CommandsNames.SERVER,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(
        port,
        () => console.log(chalk.green(`Сервер запущен на порту: ${port}`))
    );
  }
};
