/* eslint no-param-reassign: "error" */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/environment');

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
    User.belongsTo(models.Address, {
      foreignKey: 'addressId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: 'address',
    });
    User.belongsTo(models.Image, {
      foreignKey: 'imageId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: 'image',
    });
    User.hasMany(models.Post, {
      foreignKey: 'ownerId',
      as: 'myPosts',
    });
    User.belongsToMany(models.Post, {
      through: 'UserPosts',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: 'posts',
      foreignKey: 'userId',
    });
    User.hasMany(models.Request, {
      foreignKey: 'userId',
      as: 'requests',
    });
    User.hasMany(models.Comment, {
      foreignKey: 'ownerId',
      as: 'comments',
    });
  };

  User.addHook('beforeSave', async (user) => {
    if (user.password) user.passwordHash = await bcrypt.hash(user.password, 10);

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

  User.prototype.generateAuthToken = function generateAuthToken(
    forgetPassword = false,
  ) {
    const { secret, expirationMinutes, expirationLogin } = config.JWT;

    if (forgetPassword) {
      return jwt.sign({ id: this.id }, secret, {
        expiresIn: `${expirationMinutes}m`,
      });
    }

    return jwt.sign({ id: this.id }, secret, {
      expiresIn: `${expirationLogin}h`,
    });
  };

  return User;
};
