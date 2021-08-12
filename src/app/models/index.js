/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const filesystem = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const { ENVIRONMENT } = require('../../config/environment');
const config = require('../../config/database')[ENVIRONMENT];

const database = {};

let sequelize;
if (ENVIRONMENT === 'production') {
  sequelize = new Sequelize(config.database_url, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

filesystem
  .readdirSync(__dirname)
  .filter(
    (file) => file.indexOf('.') !== 0
      && file !== path.basename(__filename)
      && file.slice(-3) === '.js',
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    database[model.name] = model;
  });

Object.keys(database).forEach((modelName) => {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
});

database.sequelize = sequelize;
database.Sequelize = Sequelize;

module.exports = database;
