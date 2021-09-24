const { Image } = require('../models');

const getById = (id) => Image.findByPk(id);

const create = async ({ fileName, token }) => {
  const data = {
    name: fileName,
    token,
  };

  const newImage = await Image.create(data);

  return newImage;
};

const update = async (id, { fileName, token }) => {
  const data = {
    name: fileName,
    token,
  };

  await Image.update(data, {
    where: {
      id,
    },
  });
};

const delet = (picture) => picture.destroy();

module.exports = {
  getById,
  create,
  update,
  delet,
};
