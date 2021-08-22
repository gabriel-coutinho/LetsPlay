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

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let users = null;
  const include = [
    {
      model: Address,
      as: 'address',
    },
  ];

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
      include,
    };
    users = await User.findAndCountAll(options);

    users.pages = Math.ceil(users.count / pageSize);
  } else {
    users = await User.findAll({ include });
  }

  return users;
};

module.exports = {
  create,
  getByEmail,
  getById,
  getAll,
};
