const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/user.service');
const addressService = require('../services/address.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
  try {
    const { user, address } = req.body;

    if (!user.email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Email é obrigatório na criação do usuário' });
    }

    if (!user.phoneNumber) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Telefone é obrigatório na criação do usuário' });
    }

    if (!user.password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Senha é obrigatória na criação do usuário' });
    }

    log.info(`Inicializando criação do usuário. user's email = ${user.email}.`);
    log.info('Validando se há algum usuário com o mesmo email');

    const userWithSameEmail = await service.getByEmail(user.email);

    if (userWithSameEmail) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Já existe um usuário com este email' });
    }

    log.info('Criando usuário');
    const newUser = await service.create(user);

    log.info(`Criando endereço. userId = ${newUser.id}`);
    await addressService.create({ userId: newUser.id, ...address });

    log.info(`Buscando usuário por id = ${newUser.id}`);
    const userInfo = await service.getById(newUser.id);

    log.info('Finalizado a criação de usuário.');
    return res.status(StatusCodes.CREATED).json(userInfo);
  } catch (error) {
    const errorMsg = 'Erro ao criar usuário';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getAll = async (req, res) => {
  try {
    const { query } = req;

    log.info(`Iniciando listagem dos usuarios, page: ${query.page}`);

    const users = await service.getAll(query);

    log.info('Busca finalizada com sucesso');
    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    const errorMsg = 'Erro ao buscar usuários';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Iniciando remoção de usuário. userId = ${id}`);

    const user = await service.getOnlyUserById(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    await service.remove(user);

    log.info('Finalizando remoção de usuário.');
    return res.status(StatusCodes.OK).json('Usuário removido com sucesso.');
  } catch (error) {
    const errorMsg = 'Erro ao remover usuário';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  create,
  getAll,
  remove,
};
