import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV;

const envFilePath = NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

const env =
  dotenv.config({
    path: envFilePath,
  }).parsed || {};
export default env;
