const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/sport.service');
const imageService = require('../services/image.service');
const firebaseService = require('../services/firebase.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
  try {
    const { sport } = req.body;

    if (!sport.name) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Nome é obrigatório na criação de um esporte' });
    }

    log.info(`Inicializando criação do esporte. esporte nome = ${sport.name}.`);
    log.info('Validando se há algum esporte com o mesmo nome');

    const sportWithSameName = await service.getByName(sport.name);

    if (sportWithSameName) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Já existe um esporte com este nome' });
    }

    log.info('Criando esporte');
    const newSport = await service.create(sport);

    log.info(`Buscando esporte por id = ${newSport.id}`);
    const sportInfo = await service.getById(newSport.id);

    log.info('Finalizado a criação do esporte.');
    return res.status(StatusCodes.CREATED).json(sportInfo);
  } catch (error) {
    const errorMsg = 'Erro ao criar esporte';

    log.error(errorMsg, 'app/controllers/sport.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getAll = async (req, res) => {
  try {
    const { query } = req;

    log.info(`Iniciando listagem dos esportes, page: ${query.page}`);
    const sports = await service.getAll(query);

    log.info('Busca finalizada com sucesso');
    return res.status(StatusCodes.OK).json(sports);
  } catch (error) {
    const errorMsg = 'Erro ao buscar esportes';

    log.error(errorMsg, 'app/controllers/sport.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Iniciando busca por esporte. sportId = ${id}`);

    const sport = await service.getById(id);

    if (!sport) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Esporte não encontrado' });
    }

    log.info(`Finalizando busca por esporte. sportId = ${id}`);
    return res.status(StatusCodes.OK).json(sport);
  } catch (error) {
    const errorMsg = 'Erro ao buscar esporte';

    log.error(errorMsg, 'app/controllers/sport.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { sport } = req.body;

    log.info(`Iniciando atualização do esporte. sportId = ${id}`);
    log.info('Verificando se esporte existe');

    const existedSport = await service.getOnlySportById(id);

    if (!existedSport) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Esporte não encontrado' });
    }

    if (sport?.name) {
      log.info(`Validando nome = ${sport.name}`);

      const sportWithSameName = await service.getByName(sport.name);

      if (sportWithSameName && `${sportWithSameName.id}` !== `${id}`) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: 'Já existe um esporte com este nome' });
      }
    }

    if (sport) {
      log.info('Atualizando dados do esporte');
      await service.update(id, sport);
    }

    log.info('Buscando dados atualizados do esporte');
    const updatedSport = await service.getById(id);

    log.info('Finalizando atualização');
    return res.status(StatusCodes.OK).json(updatedSport);
  } catch (error) {
    const errorMsg = 'Erro ao atualizar esporte';

    log.error(errorMsg, 'app/controllers/sport.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Iniciando remoção de esporte. sportId = ${id}`);

    const sport = await service.getOnlySportById(id);

    if (!sport) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Esporte não encontrado' });
    }

    log.info(`Removendo esporte. sportID = ${id}`);
    await service.remove(sport);

    log.info('Finalizando remoção de esporte.');
    return res.status(StatusCodes.OK).json('Esporte removido com sucesso.');
  } catch (error) {
    const errorMsg = 'Erro ao remover esporte';

    log.error(errorMsg, 'app/controllers/sport.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const addImage = async (req, res) => {
  try {
    const { file } = req;
    const { id } = req.params;

    log.info(`Iniciando adição de imagem ao esporte de id = ${id}`);
    log.info('Buscando o esporte');

    const sport = await service.getOnlySportById(id);

    if (!sport) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Esporte não encontrado' });
    }

    log.info(`Fazendo upload da imagem. file=${file}`);
    const uploadPicture = await firebaseService.upload(file);

    let picture = null;
    if (!sport.imageId) {
      log.info('Criando imagem no banco de dados');
      picture = await imageService.create(uploadPicture);
      sport.imageId = picture.id;
      await service.update(id, sport.dataValues);
    } else {
      log.info('Deletando imagem antiga no banco de dados');
      const existedImage = await imageService.getById(sport.imageId);
      firebaseService.delet(existedImage.name);

      log.info('Atualizando imagem no banco de dados');
      await imageService.update(sport.imageId, uploadPicture);
      picture = await imageService.getById(sport.imageId);
    }

    log.info('Finalizando a adição de imagem');

    const result = {
      ...sport.dataValues,
      image: picture.firebaseUrl,
    };

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao adicionar imagem';

    log.error(errorMsg, 'app/controllers/sport.controller.js', error.message);

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
  addImage,
};
