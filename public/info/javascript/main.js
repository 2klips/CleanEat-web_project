async function fetchProtectedData() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../login_regist/index.html';
        return;
    }

    const response = await fetch('/me/mypage', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        console.log('사용자 데이터:', data);
        displayUserInfo(data);
    } else {
        console.log('인증 실패');
        window.location.href = '../login_regist/index.html';
    }
}


async function displayUserInfo(data) {
    const userInfo = document.getElementById('userinfo')
    userInfo.innerHTML = '';
    const userData = data.userData;
    if(!userData.image){
        userData.image = "./source/avata.png"
    }
    const userImg = document.createElement('img');
    userImg.src = userData.image;
    const user = document.createElement('div');
    user.id = 'user';
    user.innerHTML = `
        <h2>${userData.email}</h2>
        <p>${userData.name}</p>
        
    `;
    userInfo.appendChild(userImg);
    userInfo.appendChild(user);
}

async function logout() {
    localStorage.removeItem('token');
    window.location.href = '../login_regist/index.html';
    alert('로그아웃 되었습니다.');
}

document.addEventListener('DOMContentLoaded', fetchProtectedData);