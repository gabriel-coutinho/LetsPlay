const { Comment, User, Post } = require('../models');

const create = (data) => Comment.create(data);

const getById = (id) => Comment.findByPk(id, {
  include: [
    {
      model: User,
      as: 'owner',
    },
    {
      model: Post,
      as: 'post',
    },
  ],
});

const getByPostId = async (postId, pagination) => {
  const page = parseInt(pagination.page, 10);
  const pageSize = parseInt(pagination.pageSize, 10);
  let offset = null;
  let comments = null;
  const where = {
    postId,
  };
  const include = [
    {
      model: User,
      as: 'owner',
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
      where,
    };
    comments = await Comment.findAndCountAll(options);

    comments.pages = Math.ceil(comments.count / pageSize);
  } else {
    comments = await Comment.findAll({ where, include });
  }

  return comments;
};

const getOnlyCommentById = (id) => Comment.findByPk(id);

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let comments = null;
  const include = [
    {
      model: User,
      as: 'owner',
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
    comments = await Comment.findAndCountAll(options);

    comments.pages = Math.ceil(comments.count / pageSize);
  } else {
    comments = await Comment.findAll({ include });
  }

  return comments;
};

const update = (id, data) => Comment.update(data, {
  where: {
    id,
  },
});

const remove = (comment) => comment.destroy();

module.exports = {
  create,
  getById,
  getByPostId,
  getOnlyCommentById,
  getAll,
  update,
  remove,
};
