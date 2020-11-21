const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const mongourl = process.env.DATABASE_URL;

function connect() {
  return mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {
  connect,
};
