'use strict';

const express = require(`express`);
const path = require(`path`);

const pino = require(`pino`)(`./logs/express.log`);
const expressPino = require(`express-pino-logger`)({
  logger: pino
});

const {PathName, DEFAULT_PORT} = require(`./routes/constants.js`);

const homeRouter = require(`./routes/home.js`);
const registerRouter = require(`./routes/register.js`);
const loginRouter = require(`./routes/login.js`);
const searchRouter = require(`./routes/search.js`);
const offersRouter = require(`./routes/offers.js`);
const myRouter = require(`./routes/my.js`);
const errorRouter = require(`./routes/error.js`);

const PUBLIC_DIR = `public`;

const {getLogger} = require(`./../service/logger.js`);

const logger = getLogger();

const app = express();

app.set(`views`, `./src/express/templates`);
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/`, homeRouter);
app.use(`/${PathName.REGISTER}`, registerRouter);
app.use(`/${PathName.LOGIN}`, loginRouter);
app.use(`/${PathName.SEARCH}`, searchRouter);
app.use(`/${PathName.OFFERS}`, offersRouter);
app.use(`/${PathName.MY}`, myRouter);
app.use(`/${PathName.ERROR}`, errorRouter);

app.use((req, res) => {
  res.status(404).render(`errors/404`);
});

app.use(expressPino);

app.listen(
    DEFAULT_PORT,
    () => logger.info(`Server starts on: ${DEFAULT_PORT}`))
    .on(`error`, (err) => {
      logger.error(`Server can't start. Error: ${err}`);
    });

