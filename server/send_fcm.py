import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging

# Firebase 앱 이름 설정
app_name = 'clean-eat-app'

# Firebase 관련 인증 및 초기화
cred_path = 'easylogin.json'
cred = credentials.Certificate(cred_path)

# 앱 이름을 사용하여 앱을 초기화
firebase_admin.initialize_app(cred, name=app_name)

registration_token = 'eIwSufo-sW76f1C-0kjvxX:APA91bGE8eT_wIDZp4wp-d-Rd4BT9M-Q3MYpgg7t1n-wxrn6P-m-UpCCaD27nJ0kzK2FfHwPaugeoZ8mzQzK4w3Gh57GvvmyItRHHDXwYJ8sIcD5z3ZxJ6n7zSehYfasX1IoYFa1QNvD'

message = messaging.Message(
    notification=messaging.Notification(
        title='clean-eat',
        body='관심식당의 위생정보가 업데이트 되었습니다.',
        image='./Logo.png'
    ),
    data={
        'title': 'text',
        'message': 'python fcm test',
        'mode': 'test',
        'data': '12345',
    },
    token=registration_token,
)

response = messaging.send(message, app=firebase_admin.get_app(name=app_name))
print('Successfully sent message:', response)
