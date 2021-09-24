module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .createTable('UserPosts', {
      userId: {
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
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: 'Posts',
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
    })
    .then(() => queryInterface.sequelize.query(
      'ALTER TABLE "UserPosts" ADD CONSTRAINT "id" PRIMARY KEY ("userId", "postId")',
    )),
  down: (queryInterface) => queryInterface.dropTable('UserPosts'),
};
