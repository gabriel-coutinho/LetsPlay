const express = require('express');
const controller = require('../controllers/sport.controller');
const { verifyAuthorization } = require('../middlewares/auth');
const multer = require('../../multer');

const router = express.Router();

router.post('/', verifyAuthorization, controller.create);
router.get('/', verifyAuthorization, controller.getAll);
router.put(
  '/:id/image',
  verifyAuthorization,
  multer.single('file'),
  controller.addImage,
);
router.get('/:id', verifyAuthorization, controller.getById);
router.put('/:id', verifyAuthorization, controller.update);
router.delete('/:id', verifyAuthorization, controller.remove);

module.exports = router;
