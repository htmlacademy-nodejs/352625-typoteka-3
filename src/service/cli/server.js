'use strict';

const chalk = require(`chalk`);

const express = require(`express`);

const {
  CommandsNames,
  DEFAULT_PORT,
} = require(`./constants.js`);

const homeRouter = require(`./../routes/home.js`);

const app = express();

app.use(`/`, homeRouter);
app.use(express.json());

app.set(`json spaces`, 2);

module.exports = {
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
