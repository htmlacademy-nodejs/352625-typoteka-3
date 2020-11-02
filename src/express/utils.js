'use strict';

const {URL_API} = require(`../service/cli/constants.js`);
const {PathName, SEARCH_PARAM} = require(`../service/api/constants.js`);
const moment = require(`moment`);

const UriApi = {
  ARTICLES: `${URL_API}/${PathName.ARTICLES}`,
  CATEGORIES: `${URL_API}/${PathName.CATEGORIES}`,
  AUTH: `${URL_API}/${PathName.AUTH}`,
  SEARCH: `${URL_API}/${PathName.SEARCH}/${SEARCH_PARAM}`,
  COMMENTS: `${URL_API}/${PathName.COMMENTS}`,
};

const getHumanDate = (date) => {
  return moment(date).format(`DD.MM.YYYY, HH:mm`);
};

module.exports = {
  UriApi,
  getHumanDate,
};
