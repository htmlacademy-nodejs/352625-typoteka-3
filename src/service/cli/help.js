'use strict';

const {CommandsNames} = require(`./constants.js`);

const chalk = require(`chalk`);

const message = `
Программа запускает http-сервер и формирует файл с данными для API.
    
    Гайд:
    server <command>
    Команды:
    ${CommandsNames.VERSION}             выводит номер версии
    ${CommandsNames.HELP}                печатает этот текст
    ${CommandsNames.GENERATE} <count>    формирует файл mocks.json
    ${CommandsNames.SERVER} <port>       запускает dev-сервер
    ${CommandsNames.FILL} <count>        формирует файл fill-db-test.sql с моковыми данными
`;

module.exports = {
  name: CommandsNames.HELP,
  run() {
    console.info(chalk.gray(message));
  }
};
