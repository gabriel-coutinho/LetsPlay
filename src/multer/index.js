const multer = require('multer');
const { FIVE_MB } = require('../app/util/constants');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: FIVE_MB,
  },
});

module.exports = upload;
