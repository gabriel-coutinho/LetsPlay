const { UserPost } = require('../models');
// const log = require('../services/log.service');

const create = (data) => UserPost.create(data);

module.exports = {
  create,
};
