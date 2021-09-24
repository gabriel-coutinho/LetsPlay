const express = require('express');

const user = require('./app/routes/user.route');
const sport = require('./app/routes/sport.route');
const auth = require('./app/routes/auth.route');

const router = express.Router();

router.get('/', (_, res) => {
  res.send('Lets Play :)');
});

router.use('/auth', auth);
router.use('/user', user);
router.use('/sport', sport);

module.exports = router;
