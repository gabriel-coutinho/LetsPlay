module.exports = (sequelize) => {
  const UserPost = sequelize.define('UserPost', {}, {});
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
