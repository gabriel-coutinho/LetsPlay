const httpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const log = require('../services/log.service');
const service = require('../services/auth.service');
const { User } = require('../models');
const config = require('../../config/environment');

const { StatusCodes } = httpStatus;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    log.info(`Iniciando login. user's email = ${email}`);

    const result = await service.login(email, password);

    if (!result) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Email ou senha inválidos' });
    }

    log.info('Login finalizado');

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao realizar login';

    log.error(errorMsg, 'app/controllers/auth.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    log.info(
      `Iniciando processo de verificação de código de recuperação de senha. user email = ${email}`,
    );

    const result = await service.verifyForgetPasswordCode(email, `${code}`);

    if (!result) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ error: 'Código inválido' });
    }

    log.info('Verificação finalizada');
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao validar código de recuperação de senha.';

    log.error(errorMsg, 'app/controllers/auth.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const verifyToken = async (req, res) => {
  try {
    const { authorization } = req.headers;

    log.info('Verificando a existência de um token.');

    if (!authorization) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Acesso negado. Token não fornecido' });
    }

    log.info('Verificando se token está no formato correto.');

    const [type, token] = authorization.split(' ');

    if (!type || !token || type !== 'Bearer') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Acesso negado. Token Inválido.' });
    }

    log.info('Verificando se usuário do token existe.');

    const { id } = jwt.verify(token, config.JWT.secret);

    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    req.user = user;

    return res.status(StatusCodes.OK).json({ result: 'Token válido' });
  } catch (error) {
    const errorMsg = 'Token expirado';

    log.error(errorMsg, 'app/controllers/auth.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  login,
  verifyCode,
  verifyToken,
};
