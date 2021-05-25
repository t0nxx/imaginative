import { Sequelize } from 'sequelize';
import env from './Environment';
import pg from 'pg';

const { PGUSER, PGPASS, PGHOST, PGPORT, PGNAME } = env;

const sequelize = new Sequelize(
  `postgres://${PGUSER}:${PGPASS}@${PGHOST}:${PGPORT}/${PGNAME}`,
);

export const pgPool = new pg.Pool({
  user: PGUSER,
  database: PGNAME,
  password: PGPASS,
  port: +PGPORT,
  host: PGHOST,
});

export default sequelize;
