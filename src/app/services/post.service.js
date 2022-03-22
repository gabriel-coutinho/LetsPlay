const { Op } = require('sequelize');
const {
  Post,
  Sport,
  Address,
  User,
  Image,
  Request,
  Comment,
} = require('../models');

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
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
    },
    {
      model: Comment,
      as: 'comments',
      include: [
        {
          model: User,
          as: 'owner',
          include: [
            {
              model: Image,
              as: 'image',
            },
          ],
        },
      ],
    },
  ],
});

const getOnlyPostById = (id) => Post.findByPk(id);

const getAllNoPagination = () => Post.findAll();

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
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
    },
    {
      model: Comment,
      as: 'comments',
      include: [
        {
          model: User,
          as: 'owner',
          include: [
            {
              model: Image,
              as: 'image',
            },
          ],
        },
      ],
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
      model: User,
      as: 'owner',
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
      model: Comment,
      as: 'comments',
      include: [
        {
          model: User,
          as: 'owner',
          include: [
            {
              model: Image,
              as: 'image',
            },
          ],
        },
      ],
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

const getByStatus = async (params) => {
  const page = parseInt(params.page, 10);
  const pageSize = parseInt(params.pageSize, 10);
  const now = new Date();
  const status = params.status
    ? params.status.split(';')
    : ['OPEN', 'FULL', 'EXPIRED'];
  const { date } = params;
  let offset = null;
  let posts = null;

  const where = date
    ? {
      status,
      date: {
        [Op.lt]: now,
      },
    }
    : {
      status,
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
    {
      model: User,
      as: 'owner',
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
    },
    {
      model: Comment,
      as: 'comments',
      include: [
        {
          model: User,
          as: 'owner',
          include: [
            {
              model: Image,
              as: 'image',
            },
          ],
        },
      ],
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
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
    },
  ],
});

const getRequestsByPost = (id, status) => {
  let where = {
    postId: id,
  };

  if (status) {
    where = {
      ...where,
      status,
    };
  }

  return Request.findAll({ where });
};

const remove = (post) => post.destroy();

module.exports = {
  create,
  getById,
  getOnlyPostById,
  getAllNoPagination,
  getAll,
  update,
  getPostsByUserId,
  getByStatus,
  usersInPost,
  getRequestsByPost,
  remove,
};
