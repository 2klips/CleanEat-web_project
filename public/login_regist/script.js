// 버튼 요소를 가져옵니다.
const buttons = document.querySelectorAll('.custom-button');

// 버튼에 클릭 이벤트 리스너를 추가합니다.
buttons.forEach(button => {
    button.addEventListener('click', function() {
        // 클릭 시 버튼의 배경색을 변경합니다.
        this.classList.toggle('active'); // 버튼에 active 클래스를 추가하거나 제거합니다.
    });
});