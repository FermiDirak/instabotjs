require('dotenv').config();

const credentials = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

module.exports = credentials;