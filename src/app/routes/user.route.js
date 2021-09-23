const express = require('express');
const controller = require('../controllers/user.controller');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.put(
  '/changePassword',
  auth.verifyAuthorization,
  controller.changePassword,
);
router.post('/forgetPassword', controller.forgetPassword);
router.get('/:id', controller.getById);
router.put('/:id', auth.verifyAuthorization, controller.update);
router.delete('/:id', auth.verifyAuthorization, controller.remove);

module.exports = router;
