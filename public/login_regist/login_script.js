document.getElementById('signInButton').addEventListener('click', async (event) => {
    event.preventDefault();
    const signInEmail = document.getElementById('signInEmail').value;
    const signInPassword = document.getElementById('signInPassword').value;

    try {
        const response = await fetch('/me/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: signInEmail, password: signInPassword }),
        });

        const result = await response.json(); // await를 사용하여 JSON 응답을 기다림

        if (response.ok && result.token) { // 응답이 성공적이고 토큰이 있는 경우
            console.log('로그인 성공');
            localStorage.setItem('token', result.token);
            const token = result.token;
            console.log(localStorage.getItem('token'));
            window.location.href = '../main/index.html';
        } else {
            throw new Error(result.message || '로그인 실패');
        }
    } catch (error) {
        console.log('로그인 실패');
        const errorMessage = error.message || '아이디/비밀번호를 확인하세요.';

        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = `
            <div class="popup-content">
                <p>${errorMessage}</p>
                <button class="close-popup">닫기</button>
            </div>
        `;
        document.body.appendChild(popup);

        const closePopupBtn = popup.querySelector('.close-popup');
        closePopupBtn.addEventListener('click', () => {
            popup.remove();
        });
    }
});