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
    ${CommandsNames.SERVER} <port>       запускает dev-сервер
    ${CommandsNames.FILL_DB} <count>     инициализирует и наполняет базу 'typoteka' моковыми данными
`;

module.exports = {
  name: CommandsNames.HELP,
  run() {
    console.info(chalk.gray(message));
  }
};
