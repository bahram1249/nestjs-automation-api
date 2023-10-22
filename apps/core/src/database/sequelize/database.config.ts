// @ts-ignore
import * as dotenv from 'dotenv';
import { IDatabaseConfig } from './interfaces/dbConfig.interface';
dotenv.config();

export const databaseConfig: IDatabaseConfig = {
  development: {
    username: 'sa',
    password: 'GztsPz4G',
    database: 'nest',
    host: '0.0.0.0',
    port: 1433,
    dialect: 'mssql',
    autoLoadModels: true,
    synchronize: true,
    name: 'defaultDatabase',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_PRODUCTION,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  provision: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_PRODUCTION,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};
