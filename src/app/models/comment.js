module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
    },
    {},
  );
  Comment.associate = (models) => {
    Comment.belongsTo(models.Post, {
      foreignKey: 'postId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: 'post',
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'ownerId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: 'owner',
    });
  };
  return Comment;
};
