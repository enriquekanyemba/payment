import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // database name
  process.env.DB_USER,      // username
  process.env.DB_PASSWORD,  // password
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,        // turn on for debugging SQL queries
  }
);

export default sequelize;
