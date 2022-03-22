require('dotenv').config();
const cron = require('node-cron');
const { expirePosts } = require('./app/util/schedules');

const LogService = require('./app/services/log.service');

const environment = require('./config/environment');

const { PORT } = environment;

const app = require('./app');

// Schedule functions
cron.schedule('0 0,12 * * *', () => {
  expirePosts();
});

app.listen(PORT, () => {
  LogService.log(`API rodando na porta ${PORT}`);
});
