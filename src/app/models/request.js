module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    'Request',
    {
      status: DataTypes.STRING,
      date: DataTypes.DATE,
    },
    {},
  );

  Request.associate = (models) => {
    Request.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
    Request.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post',
      onDelete: 'CASCADE',
    });
  };
  return Request;
};
