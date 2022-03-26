const { Op } = require('sequelize');
const { Post, Request } = require('../models');
const { STATUS } = require('./constants');
const log = require('../services/log.service');

const expirePosts = async () => {
  log.info('Atualizando status dos Posts com datas expiradas');
  const now = new Date();
  await Post.update(
    { status: STATUS.EXPIRED },
    {
      where: {
        date: {
          [Op.lt]: now,
        },
      },
    },
  );
  log.info('Fim da atualização do status dos Posts com datas expiradas');
};

const expireRequests = async () => {
  log.info('Atualizando status das Requests com datas expiradas');
  const now = new Date();
  await Request.update(
    { status: STATUS.EXPIRED },
    {
      where: {
        date: {
          [Op.lt]: now,
        },
      },
    },
  );
  log.info('Fim da atualização do status das Requests com datas expiradas');
};

module.exports = {
  expirePosts,
  expireRequests,
};
