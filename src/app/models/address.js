module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'Address',
    {
      street: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      district: DataTypes.STRING,
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      number: DataTypes.STRING,
      complement: DataTypes.STRING,
    },
    {},
  );
  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user',
    });
  };
  return Address;
};
