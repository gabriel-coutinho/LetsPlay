const express = require('express');

const user = require('./app/routes/user.route');

const router = express.Router();

router.get('/', (_, res) => {
  res.send('Lets Play :)');
});

router.use('/user', user);

module.exports = router;
