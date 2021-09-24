const { FIREBASE } = require('../../config/environment');

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      name: DataTypes.STRING,
      token: DataTypes.STRING,
      firebaseUrl: {
        type: DataTypes.VIRTUAL,
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
    Image.hasOne(models.User, {
      foreignKey: 'imageId',
      as: 'user',
    });
    Image.hasOne(models.Sport, {
      foreignKey: 'imageId',
      as: 'sport',
    });
  };
  return Image;
};
