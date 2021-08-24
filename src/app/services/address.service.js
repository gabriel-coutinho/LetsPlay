const { Address } = require('../models');
// const log = require('../services/log.service');

const create = (data) => Address.create(data);

const update = async (userId, addressData) => {
  await Address.update(addressData, {
    where: {
      userId,
    },
  });
};

module.exports = {
  create,
  update,
};
