require('dotenv').config();

type Credentials = {
  username: string | undefined;
  password: string | undefined;
};

const credentials: Credentials = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

export = credentials;