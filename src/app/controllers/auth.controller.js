const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/auth.service');

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

module.exports = {
  login,
  verifyCode,
};
