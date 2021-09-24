module.exports = (sequelize, DataTypes) => {
  const UserPost = sequelize.define(
    'UserPost',
    {
      name: DataTypes.STRING,
    },
    {},
  );
  UserPost.associate = (models) => {
    UserPost.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
    UserPost.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post',
      onDelete: 'CASCADE',
    });
  };
  return UserPost;
};
