const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');
const { User } = require('../models');
const { getById } = require('../services/user.service');
const config = require('../../config/environment');
const log = require('../services/log.service');

const { StatusCodes } = httpStatus;

const verifyAuthorization = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Acesso negado. Token não fornecido' });
    }

    const [type, token] = authorization.split(' ');

    if (!type || !token || type !== 'Bearer') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Acesso negado. Token Inválido.' });
    }

    const { id } = jwt.verify(token, config.JWT.secret);

    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    req.user = user;

    return next();
  } catch (error) {
    const errorMsg = 'Token expirado';

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const loggedUser = async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Acesso negado. Token não fornecido' });
    }

    const [type, token] = authorization.split(' ');

    if (!type || !token || type !== 'Bearer') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Acesso negado. Token Inválido.' });
    }

    const { id } = jwt.verify(token, config.JWT.secret);

    const user = await getById(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    log.info('Usuário encontrado.');
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    const errorMsg = 'Token expirado';

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  verifyAuthorization,
  loggedUser,
};
