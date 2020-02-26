'use strict';

const express = require(`express`);

const {DEFAULT_PORT} = require(`./../service/cli/constants.js`);

const {OFFERS_PATH_NAME, offersRouter} = require(`./routes/offers.js`);
const {MY_PATH_NAME, myRouter} = require(`./routes/my.js`);

const app = express();

app.get(`/`, (req, res) => res.send(`/`));
app.get(`/register`, (req, res) => res.send(`/register`));
app.get(`/login`, (req, res) => res.send(`/login`));
app.get(`/search`, (req, res) => res.send(`/search`));

app.use(`/${MY_PATH_NAME}`, myRouter);
app.use(`/${OFFERS_PATH_NAME}`, offersRouter);

app.listen(
    DEFAULT_PORT,
    () => console.log(`Сервер запущен на порту: ${DEFAULT_PORT}`)
);
