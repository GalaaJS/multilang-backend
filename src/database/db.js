const { Sequelize } = require('sequelize');

const logger = require('../utilities/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

sequelize
  .authenticate()
  .then(() => logger.info('Database connected...'))
  .catch((err) => logger.error('Error: ' + err));

module.exports = sequelize;
