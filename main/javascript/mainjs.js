window.navermap_authFailure = function () {
    // 인증 실패 시 처리 코드 작성
    alert('클라이언트 인증 실패!')
}

function checkfilter() {
    if (document.getElementsByClassName('filter').checked) {
        document.getElementsByClassName('filter').checked = false;
    } else {
        document.getElementsByClassName('filter').checked = true;
    }
};