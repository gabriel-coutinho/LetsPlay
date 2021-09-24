const { v4: uuidv4 } = require('uuid');
const bucket = require('../../firebase');
const logService = require('./log.service');

const upload = (file) => new Promise((resolve, reject) => {
  if (!file) reject(new Error('É necessário um arquivo para upload'));

  const fileName = `${file.originalname}_${Date.now()}`;
  const token = uuidv4();

  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  blobStream.on('error', (error) => {
    logService.error('Erro no upload do arquivo.');
    reject(error);
  });

  blobStream.on('finish', () => {
    logService.info('Arquivo salvo.');
    resolve({ fileName, token });
  });

  blobStream.end(file.buffer);
});

const delet = (fileName) => {
  const blob = bucket.file(fileName);

  blob
    .delete()
    .then(() => {
      logService.info('Imagem deletada com sucesso');
    })
    .catch((error) => {
      logService.info('Error ao deletar imagem');

      throw new Error(error);
    });
};

module.exports = {
  upload,
  delet,
};
