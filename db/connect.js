const mongoose = require('mongoose');

const connectDB = (url) => {
  mongoose.set("strictQuery", true);
  const connection = mongoose.connect(url);
  return connection;
};

module.exports = connectDB;
