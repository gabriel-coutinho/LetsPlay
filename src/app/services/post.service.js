const {
  Post, Sport, Address, User, Image,
} = require('../models');
// const log = require('../services/log.service');

const create = (data) => Post.create(data);

const getById = (id) => Post.findByPk(id, {
  include: [
    {
      model: Sport,
      as: 'sport',
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
    },
    {
      model: Address,
      as: 'address',
    },
    {
      model: User,
      as: 'owner',
    },
  ],
});

const getOnlyPostById = (id) => Post.findByPk(id);

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let posts = null;
  const include = [
    {
      model: Sport,
      as: 'sport',
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
    },
    {
      model: Address,
      as: 'address',
    },
    {
      model: User,
      as: 'owner',
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
    posts = await Post.findAndCountAll(options);

    posts.pages = Math.ceil(posts.count / pageSize);
  } else {
    posts = await Post.findAll({ include });
  }

  return posts;
};

const update = (id, data) => Post.update(data, {
  where: {
    id,
  },
});

const getPostsByUserId = async (ownerId, pagination) => {
  const page = parseInt(pagination.page, 10);
  const pageSize = parseInt(pagination.pageSize, 10);
  let offset = null;
  let posts = null;
  const where = {
    ownerId,
  };
  const include = [
    {
      model: Sport,
      as: 'sport',
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
    },
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
      where,
    };
    posts = await Post.findAndCountAll(options);

    posts.pages = Math.ceil(posts.count / pageSize);
  } else {
    posts = await Post.findAll({ where, include });
  }

  return posts;
};

const usersInPost = (id) => Post.findByPk(id, {
  include: [
    {
      model: User,
      as: 'users',
    },
    {
      model: User,
      as: 'owner',
    },
  ],
});

const remove = (post) => post.destroy();

module.exports = {
  create,
  getById,
  getOnlyPostById,
  getAll,
  update,
  getPostsByUserId,
  usersInPost,
  remove,
};
