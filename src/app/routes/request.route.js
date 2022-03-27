const express = require('express');
const controller = require('../controllers/request.controller');
const { verifyAuthorization } = require('../middlewares/auth');

const router = express.Router();

router.post('/', verifyAuthorization, controller.create);
router.get('/', verifyAuthorization, controller.getAll);
router.get('/:id', verifyAuthorization, controller.getById);
router.get(
  '/me/:postId',
  verifyAuthorization,
  controller.existedOpenRequestOnPost,
);
router.put('/:id', verifyAuthorization, controller.update);
router.delete('/:id', verifyAuthorization, controller.remove);

module.exports = router;
