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
    Address.hasOne(models.User, {
      foreignKey: 'addressId',
      as: 'user',
    });
    Address.hasOne(models.Post, {
      foreignKey: 'addressId',
      as: 'post',
    });
  };
  return Address;
};
