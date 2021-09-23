require('dotenv').config();

const environment = {
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  BASE_URL: process.env.BASE_URL,
  API_PORT: process.env.API_PORT || 3000,
  JWT: {
    expirationMinutes: process.env.JWT_EXPIRES_TIME || 20,
    expirationLogin: process.env.JWT_EXPIRES_TIME_LOGIN || 24,
    secret: process.env.JWT_SECRET,
  },
  EMAIL: {
    email: process.env.GMAIL_EMAIL,
    password: process.env.GMAIL_PASSWORD,
    port: process.env.EMAIL_PORT,
    smtp: process.env.EMAIL_SMTP_HOST,
  },
  FIREBASE: {
    credentials: process.env.FIREBASE_CREDENTIALS,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
};

module.exports = environment;
