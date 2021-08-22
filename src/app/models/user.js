/* eslint no-param-reassign: "error" */

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: DataTypes.VIRTUAL,
      passwordHash: DataTypes.STRING,
      forgetPasswordCode: DataTypes.STRING,
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['password', 'passwordHash', 'forgetPasswordCode'],
        },
      },
    },
  );

  User.associate = (models) => {
    User.hasOne(models.Address, {
      foreignKey: 'userId',
      as: 'address',
    });
  };

  User.addHook('beforeSave', async (user) => {
    if (user.password) user.passwordHash = await bcrypt.hash(user.password, 5);

    return user;
  });

  User.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.prototype.checkForgetPasswordCode = function checkForgetPasswordCode(
    code,
  ) {
    return bcrypt.compare(code, this.forgetPasswordCode);
  };

  return User;
};
