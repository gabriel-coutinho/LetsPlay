require('dotenv').config();

const LogService = require('./app/services/log.service');

const environment = require('./config/environment');

const { API_PORT } = environment;

const app = require('./app');

app.listen(API_PORT, () => {
  LogService.log(`API rodando na porta ${API_PORT}`);
});
