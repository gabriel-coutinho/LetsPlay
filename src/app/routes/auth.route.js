const express = require('express');
const controller = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', controller.login);
router.post('/verifyCode', controller.verifyCode);
router.get('/verifyToken', controller.verifyToken);

module.exports = router;
