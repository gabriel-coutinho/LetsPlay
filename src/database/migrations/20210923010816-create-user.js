module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: Sequelize.STRING,
    },
    forgetPasswordCode: {
      type: Sequelize.STRING,
    },
    addressId: {
      type: Sequelize.INTEGER,
      references: { model: 'Addresses', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    imageId: {
      type: Sequelize.INTEGER,
      references: { model: 'Images', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
  down: (queryInterface) => queryInterface.dropTable('Users'),
};
