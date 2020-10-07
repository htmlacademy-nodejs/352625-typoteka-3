'use strict';

const {sequelize, initDb} = require(`./db.js`);

(async () => {
  await initDb();
  await sequelize.close();
})();
