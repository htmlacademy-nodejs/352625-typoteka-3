'use strict';

const chalk = require(`chalk`);
const http = require(`http`);

const {
  CommandsNames,
  DEFAULT_PORT,
} = require(`./constants.js`);

const {onClientConnect} = require(`./../utils.js`);

module.exports = {
  name: CommandsNames.SERVER,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          return console.error(chalk.red(`Ошибка при создании сервера`), err);
        }

        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });

  }
};
