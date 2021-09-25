const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/post.service');
const serviceAddress = require('../services/address.service');
const serviceUserPost = require('../services/userPost.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
  try {
    const { user } = req;
    const { post, address } = req.body;

    if (!post.title) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Título é obrigatório na criação de um post' });
    }

    if (!address) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Endereço é obrigatório na criação de um post' });
    }

    log.info(`Inicializando criação do post. post titulo = ${post.title}.`);

    log.info('Criando endereço');
    const newAddress = await serviceAddress.create(address);
    post.addressId = newAddress.id;

    log.info('Criando post');
    const date = new Date(post.date);
    post.date = date;
    const newPost = await service.create(post);

    log.info('Criando associação post usuário logado.');
    const association = { userId: user.id, postId: newPost.id };
    serviceUserPost.create(association);

    log.info(`Buscando post por id = ${newPost.id}`);
    const postInfo = await service.getById(newPost.id);

    log.info('Finalizado a criação do post.');
    return res.status(StatusCodes.CREATED).json(postInfo);
  } catch (error) {
    const errorMsg = 'Erro ao criar post';

    log.error(errorMsg, 'app/controllers/post.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getAll = async (req, res) => {
  try {
    const { query } = req;

    log.info(`Iniciando listagem dos posts, page: ${query.page}`);
    const posts = await service.getAll(query);

    log.info('Busca finalizada com sucesso');
    return res.status(StatusCodes.OK).json(posts);
  } catch (error) {
    const errorMsg = 'Erro ao buscar posts';

    log.error(errorMsg, 'app/controllers/post.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Iniciando busca por post. postId = ${id}`);

    const post = await service.getById(id);

    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Post não encontrado' });
    }

    log.info(`Finalizando busca por post. postId = ${id}`);
    return res.status(StatusCodes.OK).json(post);
  } catch (error) {
    const errorMsg = 'Erro ao buscar post';

    log.error(errorMsg, 'app/controllers/post.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { post, address } = req.body;

    log.info(`Iniciando atualização do post. postId = ${id}`);
    log.info('Verificando se post existe');

    const existedPost = await service.getOnlyPostById(id);

    if (!existedPost) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Post não encontrado' });
    }

    if (address) {
      log.info('Atualizando dados do endereço');
      if (existedPost.addressId) await serviceAddress.update(existedPost.addressId, address);
      else {
        const newAddress = await serviceAddress.create(address);
        post.addressId = newAddress.id;
      }
    }

    if (post) {
      log.info('Atualizando dados do post');
      await service.update(id, post);
    }

    log.info('Buscando dados atualizados do post');
    const updatedPost = await service.getById(id);

    log.info('Finalizando atualização');
    return res.status(StatusCodes.OK).json(updatedPost);
  } catch (error) {
    const errorMsg = 'Erro ao atualizar post';

    log.error(errorMsg, 'app/controllers/post.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Iniciando remoção de post. postId = ${id}`);

    const post = await service.getOnlyPostById(id);

    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Post não encontrado' });
    }

    log.info(`Removendo post. postID = ${id}`);
    await service.remove(post);

    log.info('Finalizando remoção do post.');
    return res.status(StatusCodes.OK).json('Post removido com sucesso.');
  } catch (error) {
    const errorMsg = 'Erro ao remover post';

    log.error(errorMsg, 'app/controllers/post.controller.js', error.message);

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