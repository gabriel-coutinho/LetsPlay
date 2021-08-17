module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Addresses', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    street: {
      type: Sequelize.STRING,
    },
    zipCode: {
      type: Sequelize.STRING,
    },
    district: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    state: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    city: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    number: {
      type: Sequelize.STRING,
    },
    complement: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Addresses'),
};
