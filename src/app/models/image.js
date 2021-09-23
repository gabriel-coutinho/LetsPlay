const { FIREBASE } = require('../../config/environment');

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      name: DataTypes.STRING,
      token: DataTypes.STRING,
      firebaseUrl: {
        type: DataTypes.STRING,
        get() {
          return `https://firebasestorage.googleapis.com/v0/b/${
            FIREBASE.storageBucket
          }/o/${this.getDataValue('name')}?alt=media&token=${this.getDataValue(
            'token',
          )}`;
        },
      },
    },
    {},
  );
  Image.associate = (models) => {
    Image.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };
  return Image;
};
