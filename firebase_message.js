const admin = require('firebase-admin');

// Firebase 관련 인증
const serviceAccount = require('./easylogin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Firebase 앱 이름 설정
  appName: 'clean-eat-app'
});

const registrationToken = 'e_UwH3p7BgXqKLJAhJo4NR:APA91bGAcUSBqIcdSo49O1saZYlSgz-RjdU5dpsrOoV0em5f0NJ7OSxbOhoCOeVfwWvrRdOX8T_AD0UcY1RVNXGIxXkyiw-1quyXxTpGMoQBetATpggUXn5lu-tP4x5R8giq-NUa6Iz-';

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
