const admin = require("firebase-admin");
const serviceAccount = require("../easylogin-b519a-firebase-adminsdk-m2qdu-a49bdfe71c.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

