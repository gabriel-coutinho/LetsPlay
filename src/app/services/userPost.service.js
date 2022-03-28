const { UserPost } = require('../models');
// const log = require('../services/log.service');

const create = (data) => UserPost.create(data);

const getByUserIdPostId = (userId, postId) => UserPost.findOne({
  where: {
    userId,
    postId,
  },
});

const remove = (userPost) => userPost.destroy();

module.exports = {
  create,
  getByUserIdPostId,
  remove,
};
