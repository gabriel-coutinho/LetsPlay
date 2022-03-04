const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/comment.service');
const servicePost = require('../services/post.service');
const serviceUser = require('../services/user.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment.content) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'content é obrigatório na criação de um comentário.' });
    }

    if (!comment.ownerId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'ownerId é obrigatório na criação de um comentário.' });
    }

    if (!comment.postId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'postId é obrigatório na criação de um comentário' });
    }

    log.info(`Verificando existência do usuário. userId:${comment.ownerId}.`);
    const existedUser = await serviceUser.getOnlyUserById(comment.ownerId);
    if (!existedUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Usuário não encontrado. userId:${comment.ownerId}` });
    }

    log.info(`Verificando existência do post. postId:${comment.postId}.`);
    const existedPost = await servicePost.getOnlyPostById(comment.postId);
    if (!existedPost) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Post não encontrado. postId:${comment.postId}` });
    }

    log.info('Inicializando criação do comentário.');

    log.info('Criando comentário');
    const newComment = await service.create(comment);

    log.info(`Buscando comentário por id = ${newComment.id}`);
    const commentInfo = await service.getById(newComment.id);

    log.info('Finalizado a criação do comentário.');
    return res.status(StatusCodes.CREATED).json(commentInfo);
  } catch (error) {
    const errorMsg = 'Erro ao criar comentário';

    log.error(errorMsg, 'app/controllers/comment.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getAll = async (req, res) => {
  try {
    const { query } = req;

    log.info(`Iniciando listagem dos comentários, page: ${query.page}`);
    const comments = await service.getAll(query);

    log.info('Busca finalizada com sucesso');
    return res.status(StatusCodes.OK).json(comments);
  } catch (error) {
    const errorMsg = 'Erro ao buscar comentários';

    log.error(errorMsg, 'app/controllers/comment.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Iniciando busca por comentário. commentId = ${id}`);

    const comment = await service.getById(id);

    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Comentário não encontrado' });
    }

    log.info(`Finalizando busca por solicitação. commentId = ${id}`);
    return res.status(StatusCodes.OK).json(comment);
  } catch (error) {
    const errorMsg = 'Erro ao buscar comentário';

    log.error(errorMsg, 'app/controllers/comment.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    log.info(`Iniciando atualização do comentário. commentId = ${id}`);
    log.info('Verificando se comentário existe');

    const existedComment = await service.getOnlyCommentById(id);
    if (!existedComment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Comentário não encontrado' });
    }

    if (!comment || !comment.content) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          error: 'content é obrigatório na atualização de um comentário.',
        });
    }

    log.info('Atualizando dados do comentário');
    await service.update(id, comment);

    log.info('Buscando dados atualizados do comentário');
    const updatedComment = await service.getById(id);

    log.info('Finalizando atualização');
    return res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    const errorMsg = 'Erro ao atualizar comentário';

    log.error(errorMsg, 'app/controllers/comment.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Iniciando remoção do comentário. commentId = ${id}`);

    const comment = await service.getOnlyCommentById(id);

    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Comentário não encontrado' });
    }

    log.info(`Removendo comentário. commentID = ${id}`);
    await service.remove(comment);

    log.info('Finalizando remoção do comentário.');
    return res.status(StatusCodes.OK).json('Comentário removido com sucesso.');
  } catch (error) {
    const errorMsg = 'Erro ao remover comentário';

    log.error(errorMsg, 'app/controllers/comment.controller.js', error.message);

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
