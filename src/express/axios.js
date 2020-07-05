'use strict';

const axios = require(`axios`).default;
const {UriApi} = require(`./utils.js`);

const getOffers = async () => (await axios.get(UriApi.OFFERS)).data;

const getCategories = async () => (await axios.get(UriApi.CATEGORIES)).data;

module.exports = {
  getOffers,
  getCategories,
};
