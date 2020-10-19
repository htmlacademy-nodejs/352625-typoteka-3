'use strict';

const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const render404Page = (req, res) => {
  res.status(404).render(`errors/404`);
  logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);
};

const render500Page = (req, res) => {
  res.status(500).render(`errors/500`);
  logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);
};

module.exports = {
  render404Page,
  render500Page,
};
