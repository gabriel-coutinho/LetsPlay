module.exports = (sequelize, DataTypes) => {
  const Sport = sequelize.define(
    'Sport',
    {
      name: DataTypes.STRING,
    },
    {},
  );
  Sport.associate = (models) => {
    Sport.belongsTo(models.Image, {
      foreignKey: 'imageId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: 'image',
    });
  };
  return Sport;
};
