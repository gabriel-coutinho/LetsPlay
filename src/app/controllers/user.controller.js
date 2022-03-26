const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/user.service');
const addressService = require('../services/address.service');
const postService = require('../services/post.service');
const emailService = require('../services/email.service');
const imageService = require('../services/image.service');
const firebaseService = require('../services/firebase.service');
const util = require('../services/util.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user.email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Email é obrigatório na criação do usuário' });
    }

    if (!user.gender) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Gênero é obrigatório na criação do usuário' });
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

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Iniciando busca por usuário. userId = ${id}`);

    const user = await service.getById(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    log.info(`Finalizando busca por usuário. userId = ${id}`);
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    const errorMsg = 'Erro ao buscar usuário';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, address } = req.body;

    log.info(`Iniciando atualização do usuário. userId = ${id}`);
    log.info('Verificando se usuário existe');

    const existedUser = await service.getOnlyUserById(id);

    if (!existedUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Usuário não encontrado' });
    }

    if (user?.email) {
      log.info(`Validando email = ${user.email}`);

      const userWithSameEmail = await service.getByEmail(user.email);

      if (userWithSameEmail && `${userWithSameEmail.id}` !== `${id}`) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: 'Já existe um usuário com este email' });
      }
    }

    if (address) {
      log.info('Atualizando dados do endereço');
      if (existedUser.addressId) await addressService.update(existedUser.addressId, address);
      else {
        const newAddress = await addressService.create(address);
        user.addressId = newAddress.id;
      }
    }

    if (user) {
      log.info('Atualizando dados do usuário');
      await service.update(id, user);
    }

    log.info('Buscando dados atualizados do usuário');
    const updatedUser = await service.getById(id);

    log.info('Finalizando atualização');
    return res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    const errorMsg = 'Erro ao atualizar usuário';

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
    log.info('Verificando se usuário existe');

    const user = await service.getOnlyUserById(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    log.info(`Removendo usuário. userID = ${id}`);
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

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    log.info(
      `Inicializando processo de recuperação de senha. user email = ${email}`,
    );
    log.info('Buscando usuário por email');

    const user = await service.getByEmail(email);

    if (user) {
      const code = util.getRandomNumber();

      log.info('Salvando codigo de recuperação');
      await service.saveForgetPasswordCode(user.id, code);

      log.info('Enviando codigo por email');
      emailService.sendForgetPasswordEmail(email, code);
    }

    log.info('Finalizando processo de recuperação de senha.');
    return res
      .status(StatusCodes.OK)
      .json('Você receberá um email de recuperação de senha.');
  } catch (error) {
    const errorMsg = 'Erro enviar email de recuperação de senha';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const changePassword = async (req, res) => {
  try {
    const { user } = req;
    const { newPassword } = req.body;

    log.info(`Iniciando atualização de senha. userEmail=${user.email}`);

    await service.changePassword(user, newPassword);

    log.info('Senha atualizada');
    return res.status(StatusCodes.OK).json('Senha atualizada');
  } catch (error) {
    const errorMsg = 'Erro ao mudar senha.';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const addImage = async (req, res) => {
  try {
    const { file } = req;
    const { id } = req.params;

    log.info(`Iniciando adição de imagem ao usuário de id = ${id}`);
    log.info('Buscando o usuário');

    const user = await service.getOnlyUserById(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    log.info(`Fazendo upload da imagem. file=${file}`);
    const uploadPicture = await firebaseService.upload(file);

    let picture = null;
    if (!user.imageId) {
      log.info('Criando imagem no banco de dados');
      picture = await imageService.create(uploadPicture);
      user.imageId = picture.id;
      await service.update(id, user.dataValues);
    } else {
      log.info('Deletando imagem antiga no banco de dados');
      const existedImage = await imageService.getById(user.imageId);
      firebaseService.delet(existedImage.name);

      log.info('Atualizando imagem no banco de dados');
      await imageService.update(user.imageId, uploadPicture);
      picture = await imageService.getById(user.imageId);
    }

    log.info('Finalizando a adição de imagem');

    const result = {
      ...user.dataValues,
      image: picture.firebaseUrl,
    };

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const errorMsg = 'Erro ao adicionar imagem';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const { query } = req;
    let { id } = req.params;

    if (id === 'me') {
      id = req.user.id;
    }

    log.info(
      `Iniciando listagem posts do usuário, userId: ${id}, page: ${query.page}`,
    );
    log.info('Verificando se usuário existe');

    const user = await service.getOnlyUserById(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    const posts = await postService.getPostsByUserId(id, query);

    log.info('Busca finalizada com sucesso');
    return res.status(StatusCodes.OK).json(posts);
  } catch (error) {
    const errorMsg = 'Erro ao buscar posts do usuário';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getRequestsByUser = async (req, res) => {
  try {
    const { query, user } = req;

    log.info('Verificando se usuário existe');

    const existedUser = await service.getOnlyUserById(user.id);

    if (!existedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    log.info(
      `Iniciando busca das solicitações do usuário. userId = ${user.id}`,
    );

    log.info('Buscando solicitações do usuário.');
    const requestByUserInfo = await service.getRequestsByUser(user.id, query);

    log.info(
      `Finalizando busca por solicitações do usuário. userId = ${user.id}`,
    );
    return res.status(StatusCodes.OK).json(requestByUserInfo);
  } catch (error) {
    const errorMsg = 'Erro ao buscar solicitações do usuário.';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

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
  forgetPassword,
  changePassword,
  addImage,
  getPostsByUserId,
  getRequestsByUser,
};
