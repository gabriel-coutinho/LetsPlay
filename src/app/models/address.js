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
  Address.associate = function (models) {
    Address.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'address',
    });
  };
  return Address;
};
