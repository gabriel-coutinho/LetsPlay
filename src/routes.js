const express = require('express');

const user = require('./app/routes/user.route');
const sport = require('./app/routes/sport.route');
const post = require('./app/routes/post.route');
const request = require('./app/routes/request.route');
const auth = require('./app/routes/auth.route');

const router = express.Router();

router.get('/', (_, res) => {
  res.send('Lets Play :)');
});

router.use('/auth', auth);
router.use('/user', user);
router.use('/sport', sport);
router.use('/post', post);
router.use('/request', request);

module.exports = router;
