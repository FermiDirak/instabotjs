require('dotenv').config();

type Credentials = {
  username: string;
  password: string;
};

const credentials: Credentials = {
  username: process.env.USERNAME || '',
  password: process.env.PASSWORD || '',
};

export = credentials;