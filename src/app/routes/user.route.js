const express = require('express');
const controller = require('../controllers/user.controller');
const { verifyAuthorization, loggedUser } = require('../middlewares/auth');
const multer = require('../../multer');

const router = express.Router();
router.get('/', verifyAuthorization, controller.getAll);
router.get('/loggedUser', loggedUser);
router.put('/changePassword', verifyAuthorization, controller.changePassword);
router.post('/forgetPassword', controller.forgetPassword);
router.put(
  '/:id/image',
  verifyAuthorization,
  multer.single('file'),
  controller.addImage,
);
router.get('/:id/posts', verifyAuthorization, controller.getPostsByUserId);
router.get('/:id/requests', verifyAuthorization, controller.getRequestsByUser);
router.get('/:id', verifyAuthorization, controller.getById);
router.put('/:id', verifyAuthorization, controller.update);
router.delete('/:id', verifyAuthorization, controller.remove);

module.exports = router;
