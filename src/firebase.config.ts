import * as admin from 'firebase-admin';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    admin.initializeApp({
        projectId: process.env.PROJECT_ID
    });

    admin.firestore().settings({
        host: 'localhost:8080',
        ssl: false,
        ignoreUndefinedProperties: true
    });
} else {
    const serviceAccount = require('./serviceAccountKey.json');
    const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG || '{}');
    adminConfig.credential = admin.credential.cert(serviceAccount);
    admin.initializeApp(adminConfig);
    admin.firestore().settings({ ignoreUndefinedProperties: true });
}

export { admin };
