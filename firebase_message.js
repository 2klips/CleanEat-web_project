const admin = require('firebase-admin');

// Firebase 관련 인증
const serviceAccount = require('./easylogin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Firebase 앱 이름 설정
  appName: 'clean-eat-app'
});

const registrationToken = 'eIwSufo-sW76f1C-0kjvxX:APA91bGE8eT_wIDZp4wp-d-Rd4BT9M-Q3MYpgg7t1n-wxrn6P-m-UpCCaD27nJ0kzK2FfHwPaugeoZ8mzQzK4w3Gh57GvvmyItRHHDXwYJ8sIcD5z3ZxJ6n7zSehYfasX1IoYFa1QNvD';

const message = {
  notification: {
    title: 'clean-eat',
    body: '관심식당의 위생정보가 업데이트 되었습니다.',
  },
  data: {
    title: 'text',
    message: 'python fcm test',
    mode: 'test',
    data: '12345',
  },
  token: registrationToken,
};

admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.error('Error sending message:', error);
  });
