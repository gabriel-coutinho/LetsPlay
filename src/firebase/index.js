const firebaseAdmin = require('firebase-admin');
const { FIREBASE } = require('../config/environment');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(FIREBASE.credentials),
  storageBucket: FIREBASE.storageBucket,
});

const bucket = firebaseAdmin.storage().bucket();

module.exports = bucket;
