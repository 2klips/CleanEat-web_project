window.onload = function(){
    const alram = document.getElementById("push_alram").checked;
    console.log(alram);
};

function pushAlramSwitch(){
    const alram = document.getElementById("push_alram").checked;
    console.log(alram);
}
// 버튼을 클릭하면 동그라미가 오른쪽으로 움직이고 배경색은 하늘색으로 변경.
var isBackgroundChanged = false; 
    function toggleBackground() {
        var button = document.querySelector('.custom-button');
        var circleIcon = document.querySelector('.circle-icon');
        
            if (!isBackgroundChanged) {
                button.style.backgroundColor = '#2FD8FF'; // Change to the new color
                circleIcon.style.right = '5px'; // Move circle-icon to the right
                requestToken()
            } else {
                button.style.backgroundColor = '#FFFFFF'; // Revert to the original color
                circleIcon.style.right = '40px'; // Move circle-icon back to its original position
                deleteToken()
            }
        
                isBackgroundChanged = !isBackgroundChanged;
};