const admin = require('firebase-admin');

// Firebase 관련 인증
const serviceAccount = require('../easylogin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Firebase 앱 이름 설정
  appName: 'clean-eat-app'
});

const registrationToken = 'eYKRxyA7G0DSyrhjCnZuzI:APA91bHVTBi_VuRoFZ-yutnabcN9Wt_LyBAbk6oeOmMdNRGzo5QJ5k-5RoX5Nz71r1vcerLtiExmCxaQuz-LaR0JDPYGcqdsEBXCKz69IwhJoqCjyPrw_S11HSxt6vYR0jTZ--_Q-Uio';

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
