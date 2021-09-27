const bcrypt = require('bcryptjs');
const {
  User, Address, Image, Request,
} = require('../models');
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
    {
      model: Image,
      as: 'image',
    },
  ],
});

const getOnlyUserById = (id) => User.findByPk(id);

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
    {
      model: Image,
      as: 'image',
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

const update = (id, data) => User.update(data, {
  where: {
    id,
  },
});

const saveForgetPasswordCode = async (id, code) => {
  const codeHash = await bcrypt.hash(`${code}`, 5);
  const userData = {
    forgetPasswordCode: codeHash,
  };

  await User.update(userData, {
    where: {
      id,
    },
  });
};

const changePassword = (user, newPassword) => {
  const updatedUser = user;

  updatedUser.password = newPassword;
  updatedUser.forgetPasswordCode = null;

  return updatedUser.save();
};

const getRequestsByUser = (id, status) => {
  let where = {
    userId: id,
  };

  if (status) {
    where = {
      ...where,
      status,
    };
  }

  return Request.findAll({ where });
};

const remove = (user) => user.destroy();

module.exports = {
  create,
  getByEmail,
  getById,
  getOnlyUserById,
  getAll,
  update,
  saveForgetPasswordCode,
  changePassword,
  getRequestsByUser,
  remove,
};
