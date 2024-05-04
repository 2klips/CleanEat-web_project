const logincheck = false
window.navermap_authFailure = function () {
    // 인증 실패 시 처리 코드 작성
    alert('클라이언트 인증 실패!')
}

document.addEventListener('DOMContentLoaded', function() {
    var introScreen = document.getElementById('introScreen');
    var container = document.getElementById('container');

    // sessionStorage에서 'introSeen' 값을 확인
    if (!sessionStorage.getItem('introSeen')) {
        introScreen.style.display = 'flex'; // 인트로 화면을 보여줍니다
        container.style.display = 'none'; // 메인 컨텐츠를 숨깁니다

        setTimeout(() => {
            introScreen.style.display = 'none'; // 인트로 화면을 숨깁니다
            container.style.display = 'block'; // 메인 컨텐츠를 보여줍니다
            sessionStorage.setItem('introSeen', 'true'); // sessionStorage에 방문 기록을 저장합니다
        }, 2300); // 예를 들어 5초 후에 인트로 화면을 숨기고 메인 컨텐츠를 보여줍니다
    } else {
        introScreen.style.display = 'none'; // 인트로 화면을 숨깁니다
        container.style.display = 'block'; // 메인 컨텐츠를 즉시 보여줍니다
    }
});
