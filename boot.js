const log = require('debug')('boot');
const db = require('./db');

module.exports = async function boot(app) {
  log('connecting to database...');
  await db.connect();
  log('connected to database!');

  const port = process.env.PORT;

  app.listen(port, () => {
    log(`Example app listening at port: ${port}`);
  });
};
