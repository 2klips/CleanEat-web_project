const logincheck = false
window.navermap_authFailure = function () {
    // 인증 실패 시 처리 코드 작성
    alert('클라이언트 인증 실패!')
}


// function changeherf(){
//     const loginbtn = document.getElementById("loginbtn");
//     if(logincheck){
//         loginbtn.href = "../info/main.html";
//     }else{
//         loginbtn.href = "../login_regist/index.html";
//     }
// }


document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        document.getElementById('introScreen').style.display = 'none'; // 인트로 화면을 숨깁니다.
        document.getElementById('mainContent').style.display = 'block'; // 메인 콘텐츠를 표시합니다.
    }, 2200); // 2000 밀리초 후에 실행
});