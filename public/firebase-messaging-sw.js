importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDLwmwOZiprAUt16GYQNznmNBoOKJNCYG4",
  authDomain: "easylogin-b519a.firebaseapp.com",
  projectId: "easylogin-b519a",
  storageBucket: "easylogin-b519a.appspot.com",
  messagingSenderId: "270766993601",
  appId: "1:270766993601:web:aa3199d115b3b816412440",
  measurementId: "G-XM5967EN5W"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firebase 메시징 초기화
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // 사용자 정의 알림 작성
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});