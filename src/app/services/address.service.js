const { Address } = require('../models');
// const log = require('../services/log.service');

const create = (data) => Address.create(data);

module.exports = {
  create,
};
