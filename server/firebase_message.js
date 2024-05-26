const admin = require('firebase-admin');

// Firebase 관련 인증
const serviceAccount = require('../easylogin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Firebase 앱 이름 설정
  appName: 'clean-eat-app'
});

const registrationToken = 'e_UwH3p7BgXqKLJAhJo4NR:APA91bGAcUSBqIcdSo49O1saZYlSgz-RjdU5dpsrOoV0em5f0NJ7OSxbOhoCOeVfwWvrRdOX8T_AD0UcY1RVNXGIxXkyiw-1quyXxTpGMoQBetATpggUXn5lu-tP4x5R8giq-NUa6Iz-';
async function send_message (req, res, next) {
  const { title, body } = req.body;
  const message = {
    notification: {
      title: title,
      body: body,
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
  .then(() => {
    console.log('Successfully sent message');
    res.status(200).send({ message: '알림 전송 성공' });
  })
  .catch((error) => {
    console.error('Error sending message:', error);
    res.status(500).send({ message: '알림 전송 실패' });
  });
}

module.exports = { send_message };