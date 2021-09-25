module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      title: DataTypes.STRING,
      describe: DataTypes.STRING,
      price: DataTypes.INTEGER,
      date: DataTypes.DATE,
    },
    {},
  );
  Post.associate = (models) => {
    Post.belongsTo(models.Address, {
      foreignKey: 'addressId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: 'address',
    });
    Post.belongsTo(models.User, {
      foreignKey: 'ownerId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: 'owner',
    });
    Post.belongsTo(models.Sport, {
      foreignKey: 'sportId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: 'sport',
    });
    Post.belongsToMany(models.User, {
      through: 'UserPosts',
      as: 'users',
      foreignKey: 'postId',
    });
  };
  return Post;
};
