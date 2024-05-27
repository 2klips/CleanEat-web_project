const admin = require('firebase-admin');
const userDB = require('./database/userDB');

// Firebase 관련 인증
const serviceAccount = require('../easylogin.json');
const { get } = require('http');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Firebase 앱 이름 설정
  appName: 'clean-eat-app'
});

async function subscribeToTopic(topic) {
  try {
      // 프로미스 해결
      const tokens = await userDB.getDeviceToken();
      
      // 디바이스 토큰 배열 생성
      const registrationTokens = tokens.filter(token => token !== '')
      console.log('tokens:', tokens);
      console.log('registrationTokens:', registrationTokens);

      // 토픽 구독
      await admin.messaging().subscribeToTopic(registrationTokens, topic);
      
      console.log('Successfully subscribed to topic:', topic);
  } catch (error) {
      console.error('Error subscribing to topic:', error);
  }
}

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
    topic: 'all',
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

async function send_update_message (req, res, next) {
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
    topic: 'all',
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

module.exports = { send_message, send_update_message, subscribeToTopic};