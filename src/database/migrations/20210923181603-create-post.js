module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Posts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    describe: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.DECIMAL(20, 2),
      defaultValue: '0.00',
    },
    date: {
      type: Sequelize.DATE,
    },
    vacancy: {
      type: Sequelize.INTEGER,
      defaultValue: '0',
    },
    sportId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: false,
      references: {
        model: 'Sports',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    addressId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: false,
      references: {
        model: 'Addresses',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    ownerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: 'Users',
        key: 'id',
      },
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
  down: (queryInterface) => queryInterface.dropTable('Posts'),
};
