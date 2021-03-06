const express = require('express');
const controller = require('../controllers/post.controller');
const { verifyAuthorization } = require('../middlewares/auth');

const router = express.Router();

router.post('/', verifyAuthorization, controller.create);
router.get('/', verifyAuthorization, controller.getByStatus);
router.get('/all', verifyAuthorization, controller.getAll);
router.get('/:id/users', verifyAuthorization, controller.usersInPost);
router.get('/:id/requests', verifyAuthorization, controller.getRequestsByPost);
router.get('/:id', verifyAuthorization, controller.getById);
router.put('/:id', verifyAuthorization, controller.update);
router.delete('/:id', verifyAuthorization, controller.remove);

module.exports = router;
