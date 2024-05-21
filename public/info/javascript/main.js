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
        const userData = await response.json();
        console.log('사용자 데이터:', userData);
    } else {
        console.log('인증 실패');
        window.location.href = '../login_regist/index.html';
    }
}



// 페이지 로드 시 fetchProtectedData 함수를 호출하여 보호된 데이터 요청
document.addEventListener('DOMContentLoaded', fetchProtectedData);