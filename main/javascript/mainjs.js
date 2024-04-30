const logincheck = false
window.navermap_authFailure = function () {
    // 인증 실패 시 처리 코드 작성
    alert('클라이언트 인증 실패!')
}


function changeherf(){
    loginbtn = document.getElementById("loginbtn");
    if(logincheck){
        loginbtn.href = "../info/main.html";
    }else{
        loginbtn.href = "../login regist/index.html";
    }
}