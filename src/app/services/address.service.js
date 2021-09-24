const { Address } = require('../models');
// const log = require('../services/log.service');

const create = (data) => Address.create(data);

const update = async (id, addressData) => {
  await Address.update(addressData, {
    where: {
      id,
    },
  });
};

module.exports = {
  create,
  update,
};
