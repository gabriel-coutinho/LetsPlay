require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  development: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    options: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    },
  },
  test: {},
  production: {
    database_url: process.env.DATABASE_URL,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        required: true,
        rejectUnauthorized: false,
      },
    },
  },
};
