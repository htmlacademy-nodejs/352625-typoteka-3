'use strict';

const express = require(`express`);
const sessionMiddleware = require(`./session-store.js`);
const path = require(`path`);
const http = require(`http`);
const socketIO = require(`socket.io`);
require(`dotenv`).config();

const pino = require(`pino`)(`./src/express/logs/express.log`);
const expressPino = require(`express-pino-logger`)({
  logger: pino
});

const {PathName, DEFAULT_PORT} = require(`./routes/constants.js`);

const homeRouter = require(`./routes/home.js`);
const registerRouter = require(`./routes/register.js`);
const loginRouter = require(`./routes/login.js`);
const logoutRouter = require(`./routes/logout.js`);
const searchRouter = require(`./routes/search.js`);
const articlesRouter = require(`./routes/articles.js`);
const myRouter = require(`./routes/my.js`);
const errorRouter = require(`./routes/error.js`);

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const {getLogger} = require(`./../service/logger.js`);

const logger = getLogger();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(sessionMiddleware);

app.set(`views`, `./src/express/templates`);
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use(express.urlencoded({extended: false}));

app.use(`/`, homeRouter);
app.use(`/${PathName.REGISTER}`, registerRouter);
app.use(`/${PathName.LOGIN}`, loginRouter);
app.use(`/${PathName.LOGOUT}`, logoutRouter);
app.use(`/${PathName.SEARCH}`, searchRouter);
app.use(`/${PathName.ARTICLES}`, articlesRouter);
app.use(`/${PathName.MY}`, myRouter);
app.use(`/${PathName.ERROR}`, errorRouter);

app.use((req, res) => {
  res.status(404).render(`errors/404`);
});

app.use(expressPino);

io.on(`connection`, (socket) => {
  // TODO Не могу разобраться почему в консоль не выводятся соответсвующие сообщения. Наверное что-то не донастроил.
  const {address: ip} = socket.handshake;
  console.log(`Новое подключение: ${ip}`);

  socket.on(`disconnect`, () => {
    console.log(`Клиент отключён: ${ip}`);
  });
});

server.listen(
    DEFAULT_PORT,
    () => logger.info(`Server starts on: ${DEFAULT_PORT}`))
    .on(`error`, (err) => {
      logger.error(`Server can't start. Error: ${err}`);
    });

