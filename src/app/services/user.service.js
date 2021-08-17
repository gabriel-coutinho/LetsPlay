const { User, Address } = require('../models');
// const log = require('../services/log.service');

const create = (data) => User.create(data);

const getByEmail = (email) => User.findOne({
  where: {
    email,
  },
});

const getById = (id) => User.findByPk(id, {
  include: [
    {
      model: Address,
      as: 'address',
    },
  ],
});

module.exports = {
  create,
  getByEmail,
  getById,
};
