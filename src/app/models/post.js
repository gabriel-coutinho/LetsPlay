module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      describe: DataTypes.STRING,
      price: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: '0.00',
      },
      date: DataTypes.DATE,
      vacancy: {
        type: DataTypes.INTEGER,
        defaultValue: '0',
      },
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
