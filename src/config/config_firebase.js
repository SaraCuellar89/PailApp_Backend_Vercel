const admin = require('firebase-admin');
const serviceAccount = require('./pailapp-firebase-adminsdk-fbsvc-e55d965758.json');

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
});

module.exports = admin;