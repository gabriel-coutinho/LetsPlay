const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/request.service');
const serviceUserPost = require('../services/userPost.service');
const servicePost = require('../services/post.service');
const serviceUser = require('../services/user.service');

const { STATUS } = require('../util/constants');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
  try {
    const { request } = req.body;

    if (!request.userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'userId é obrigatório na criação de uma solicitação' });
    }

    if (!request.postId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'postId é obrigatório na criação de uma solicitação' });
    }
    if (!request.postId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'postId é obrigatório na criação de uma solicitação' });
    }

    log.info(`Verificando existência do usuário. userId:${request.userId}.`);
    const existedUser = await serviceUser.getOnlyUserById(request.userId);
    if (!existedUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Usuário não encontrado. userId:${request.userId}` });
    }

    log.info(`Verificando existência do post. postId:${request.postId}.`);
    const existedPost = await servicePost.getOnlyPostById(request.postId);
    if (!existedPost) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Post não encontrado. postId:${request.postId}` });
    }

    log.info('Inicializando criação da solicitação.');

    log.info('Criando solicitação');
    request.status = STATUS.OPEN;
    request.date = existedPost.date;
    const newRequest = await service.create(request);

    log.info(`Buscando request por id = ${newRequest.id}`);
    const requestInfo = await service.getById(newRequest.id);

    log.info('Finalizado a criação da solicitação.');
    return res.status(StatusCodes.CREATED).json(requestInfo);
  } catch (error) {
    const errorMsg = 'Erro ao criar solicitação';

    log.error(errorMsg, 'app/controllers/request.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getAll = async (req, res) => {
  try {
    const { query } = req;

    log.info(`Iniciando listagem das solicitações, page: ${query.page}`);
    const requests = await service.getAll(query);

    log.info('Busca finalizada com sucesso');
    return res.status(StatusCodes.OK).json(requests);
  } catch (error) {
    const errorMsg = 'Erro ao buscar solicitações';

    log.error(errorMsg, 'app/controllers/request.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Iniciando busca por solicitação. requestId = ${id}`);

    const request = await service.getById(id);

    if (!request) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Solicitação não encontrado' });
    }

    log.info(`Finalizando busca por solicitação. requestId = ${id}`);
    return res.status(StatusCodes.OK).json(request);
  } catch (error) {
    const errorMsg = 'Erro ao buscar solicitação';

    log.error(errorMsg, 'app/controllers/request.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { request } = req.body;
    const { user } = req;

    log.info(`Iniciando atualização da solicitação. requestId = ${id}`);
    log.info('Verificando se solicitação existe');

    const existedRequest = await service.getById(id);

    if (!existedRequest) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Solicitação não encontrado' });
    }

    if (request?.status) {
      if (request.status === STATUS.ACCEPTED) {
        log.info('Verificando se o usuário logado é dono do post.');
        if (user.id !== existedRequest.post.ownerId) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error:
              'Solicitação não pode ser aceita por usuário diferente do dono do post.',
          });
        }
        log.info('Adicionando usuário ao post');
        serviceUserPost.create({
          userId: existedRequest.userId,
          postId: existedRequest.postId,
        });
      }
    }
    log.info('Atualizando dados da solicitação');
    await service.update(id, request);

    log.info('Buscando dados atualizados da solicitação');
    const updatedRequest = await service.getById(id);

    log.info('Finalizando atualização');
    return res.status(StatusCodes.OK).json(updatedRequest);
  } catch (error) {
    const errorMsg = 'Erro ao atualizar solicitação';

    log.error(errorMsg, 'app/controllers/request.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Iniciando remoção da solicitação. requestId = ${id}`);

    const request = await service.getOnlyRequestById(id);

    if (!request) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Solicitação não encontrado' });
    }

    log.info(`Removendo solicitação. requestID = ${id}`);
    await service.remove(request);

    log.info('Finalizando remoção da solicitação.');
    return res.status(StatusCodes.OK).json('Solicitação removida com sucesso.');
  } catch (error) {
    const errorMsg = 'Erro ao remover solicitação';

    log.error(errorMsg, 'app/controllers/request.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
