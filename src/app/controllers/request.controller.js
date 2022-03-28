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
    const { user } = req;

    if (!request.postId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'postId é obrigatório na criação de uma solicitação' });
    }

    log.info(`Verificando existência do usuário. userId:${user.id}.`);
    const existedUser = await serviceUser.getOnlyUserById(user.id);
    if (!existedUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Usuário não encontrado. userId:${user.id}` });
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
    request.userId = user.id;
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

const existedOpenRequestOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { user } = req;

    log.info(
      `Iniciando existencia de solicitação aberta. userId = ${user.id}. postId = ${postId}`,
    );
    log.info('Verificando existência do post');

    const existedPost = servicePost.getOnlyPostById(postId);
    if (!existedPost) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Post não encontrado' });
    }

    log.info('Verificando existência do user');
    const existedUser = serviceUser.getOnlyUserById(user.id);
    if (!existedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'User não encontrado' });
    }

    log.info('Verificando existência de request open');
    const request = await service.existedOpenRequestOnPost(user.id, postId);

    if (!request) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Solicitação não encontrada' });
    }

    log.info(
      `Finalizando existe solicitação aberta. requestId = ${request.id}`,
    );
    return res.status(StatusCodes.OK).json(request);
  } catch (error) {
    const errorMsg = 'Erro ao verificar solicitação aberta';

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

        log.info('Verificando se post está cheio');
        if (
          existedRequest.post.status === STATUS.FULL
          || existedRequest.post.usersCount >= existedRequest.post.vacancy
        ) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Solicitação não pode ser aceita post cheio.',
          });
        }

        const userInPost = await serviceUserPost.getByUserIdPostId(
          existedRequest.userId,
          existedRequest.postId,
        );
        if (!userInPost) {
          log.info('Adicionando usuário ao post');
          await serviceUserPost.create({
            userId: existedRequest.userId,
            postId: existedRequest.postId,
          });

          await servicePost.update(existedRequest.post.id, {
            usersCount: existedRequest.post.usersCount + 1,
          });

          const updatedPost = await servicePost.getOnlyPostById(
            existedRequest.post.id,
          );
          const now = new Date();
          log.info('Colocando status para cheio se necessário');
          if (
            updatedPost.date >= now
            && updatedPost.usersCount >= updatedPost.vacancy
          ) {
            await servicePost.update(updatedPost.id, { status: STATUS.FULL });
          }
        }
      } else if (request.status === STATUS.REJECTED) {
        log.info('Verificando se o usuário logado é dono do post.');
        if (user.id !== existedRequest.post.ownerId) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error:
              'Solicitação não pode ser rejeitada por usuário diferente do dono do post.',
          });
        }

        const userInPost = await serviceUserPost.getByUserIdPostId(
          existedRequest.userId,
          existedRequest.postId,
        );
        log.info(userInPost);
        if (userInPost) {
          log.info('Removendo usuário do post');
          await serviceUserPost.remove(userInPost);

          await servicePost.update(existedRequest.post.id, {
            usersCount: existedRequest.post.usersCount - 1,
          });

          const updatedPost = await servicePost.getOnlyPostById(
            existedRequest.post.id,
          );

          log.info('Retirando status de cheio se necessário');
          const now = new Date();
          if (
            updatedPost.date >= now
            && updatedPost.usersCount < updatedPost.vacancy
          ) {
            await servicePost.update(updatedPost.id, { status: STATUS.OPEN });
          }
        }
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

    const request = await service.getById(id);

    if (!request) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Solicitação não encontrado' });
    }

    const userInPost = await serviceUserPost.getByUserIdPostId(
      request.userId,
      request.postId,
    );

    if (userInPost) {
      log.info('Removendo usuário do post');
      await serviceUserPost.remove(userInPost);

      await servicePost.update(request.post.id, {
        usersCount: request.post.usersCount - 1,
      });

      const updatedPost = await servicePost.getOnlyPostById(request.post.id);

      log.info('Retirando status de cheio se necessário');
      const now = new Date();
      if (
        updatedPost
        && updatedPost.date >= now
        && updatedPost.usersCount < updatedPost.vacancy
      ) {
        await servicePost.update(updatedPost.id, { status: STATUS.OPEN });
      }
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
  existedOpenRequestOnPost,
  update,
  remove,
};
