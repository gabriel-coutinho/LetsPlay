const { Op } = require('sequelize');
const { Request, User, Post } = require('../models');

const create = (data) => Request.create(data);

const getById = (id) => Request.findByPk(id, {
  include: [
    {
      model: User,
      as: 'user',
    },
    {
      model: Post,
      as: 'post',
    },
  ],
});

const getOnlyRequestById = (id) => Request.findByPk(id);

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let requests = null;
  const include = [
    {
      model: User,
      as: 'user',
    },
    {
      model: Post,
      as: 'post',
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
    requests = await Request.findAndCountAll(options);

    requests.pages = Math.ceil(requests.count / pageSize);
  } else {
    requests = await Request.findAll({ include });
  }

  return requests;
};

const update = (id, data) => Request.update(data, {
  where: {
    id,
  },
});

const existedOpenRequestOnPost = (userId, postId) => {
  const status = 'OPEN';
  const now = new Date();
  const where = {
    userId,
    postId,
    status,
    date: {
      [Op.gte]: now,
    },
  };
  return Request.findOne({ where });
};

const remove = (request) => request.destroy();

module.exports = {
  create,
  getById,
  getOnlyRequestById,
  getAll,
  existedOpenRequestOnPost,
  update,
  remove,
};
