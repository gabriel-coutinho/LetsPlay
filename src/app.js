const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
// const cron = require('node-cron');

const routes = require('./routes');

require('./database');

const corsOptions = {
  origin: '*',
};

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', routes);

// Schedule functions
// cron.schedule('0 0,12 * * * *',);

module.exports = app;
