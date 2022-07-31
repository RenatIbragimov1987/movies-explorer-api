require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/moviesdb';
const PORT = process.env.PORT || 4000;

module.exports = {
  MONGO_URL,
  PORT,
};
