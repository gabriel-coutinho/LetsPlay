module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Posts', 'status', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
    defaultValue: 'OPEN',
  }),

  down: (queryInterface) => queryInterface.removeColumn('Posts', 'status'),
};
