module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Requests', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    userId: {
      type: Sequelize.INTEGER,
      unique: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    postId: {
      type: Sequelize.INTEGER,
      unique: false,
      references: {
        model: 'Posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
  down: (queryInterface) => queryInterface.dropTable('Requests'),
};
