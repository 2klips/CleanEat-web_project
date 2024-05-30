// 아아디 부분:

// 아이디 정규식: @ 앞에 문자, @ 뒤에 문자, . 뒤에 문자 존재해야함.
function checkID() {
    var email = document.getElementById('signUpEmail').value;
    var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var pElement = document.getElementById('p6');
    if (isValid) {
        console.log(email);
        fetch(`/me/findByEmail?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            if (res.status === 200) {
                pElement.textContent = '가입이 가능한 이메일입니다.';
                pElement.style.color = '#0ECFFF';
            } else if (res.status === 409) {
                pElement.textContent = '이미 사용중인 이메일입니다.';
                pElement.style.color = 'red';
            } else {
                throw new Error('서버 오류가 발생했습니다.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            pElement.textContent = error.message;
            pElement.style.color = 'red';
        });
    //     pElement.textContent = '가입이 가능한 아이디입니다.';
    //     pElement.style.color = '#0ECFFF';
    } else {
        pElement.textContent = '이메일 형식을 확인해주세요.';
        pElement.style.color = 'red';
    }
};


// 비밀번호 부분:

// 비밀번호 정규식: 11자 이상, 대문자와 특수문자를 반드시 포함해야함.
function checkPassword() {
    var password = document.getElementById('signUpPassword').value;
    var isValid = password.length >= 11 && /[A-Z]/.test(password) && /[\W_]/.test(password);
    var pElement = document.querySelector('.int-area>#p2');
        if (isValid) {
            pElement.textContent = '비밀번호가 유효합니다.';
            pElement.style.color = '#0ECFFF';
        } else {
            pElement.textContent = '사용 불가능한 비밀번호입니다.';
            pElement.style.color = '#FF0000';
        }
};

// 비밀번호 칸 입력값과 비밀번호 확인 칸 입력값이 같은지 확인
var passwordMatchMessage = null;
    function checkPasswordMatch() {
        var password = document.getElementById('signUpPassword').value;
        var confirmPassword = document.getElementById('signUpPasswordRe').value;
        
        var passwordsMatch = password === confirmPassword;
        
        var pElement2 = document.querySelector('.int-area>#p3');
                
            if (passwordsMatch) {
                pElement2.textContent = '비밀번호가 확인되었습니다.';
                pElement2.style.color = '#0ECFFF';
            } else {
                pElement2.textContent = '비밀번호가 일치하지 않습니다.';
                pElement2.style.color = '#FF0000';
            }
    };

// 눈(off) 버튼 클릭하면 비밀번호에 입력된 값을 텍스트 형으로 변환 -> 비밀번호가 보임.
function toggleToText() {
    var passwordInput = document.getElementById("signUpPassword");
    var svgButton = document.getElementById("svgButton");
    var svgButton2 = document.getElementById("svgButton2");

    passwordInput.type = "text";
    svgButton.style.display = "none";
    svgButton2.style.display = "inline";
    svgButton2.setAttribute("style", "color: black");
};

// 눈(on) 버튼 클릭하면 비밀번호에 입력된 값을 비밀번호 형으로 변환 -> 비밀번호가 안보임.
function toggleToPassword() {
    var passwordInput = document.getElementById("signUpPassword");
    var svgButton = document.getElementById("svgButton");
    var svgButton2 = document.getElementById("svgButton2");

    passwordInput.type = "password";
    svgButton.style.display = "inline";
    svgButton2.style.display = "none";
};

// 눈(off) 버튼 클릭하면 비밀번호 확인에 입력된 값을 텍스트 형으로 변환 -> 비밀번호 확인 보임.
function toggleToText2() {
    var passwordInput = document.getElementById("signUpPasswordRe");
    var svgButton = document.getElementById("svgButton3");
    var svgButton2 = document.getElementById("svgButton4");

    passwordInput.type = "text";
    svgButton.style.display = "none";
    svgButton2.style.display = "inline";
    svgButton2.setAttribute("style", "color: black");
};

// 눈(on) 버튼 클릭하면 비밀번호 확인에 입력된 값을 텍스트 형으로 변환 -> 비밀번호 확인 안보임.
function toggleToPassword2() {
    var passwordInput = document.getElementById("signUpPasswordRe");
    var svgButton = document.getElementById("svgButton3");
    var svgButton2 = document.getElementById("svgButton4");

    passwordInput.type = "password";
    svgButton.style.display = "inline";
    svgButton2.style.display = "none";
};



// 주소 검색 부분:

//본 예제에서는 도로명 주소 표기 방식에 대한 법령에 따라, 내려오는 데이터를 조합하여 올바른 주소를 구성하는 방법을 설명합니다.
function sample4_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var extraRoadAddr = ''; // 참고 항목 변수

            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if(data.buildingName !== '' && data.apartment === 'Y'){
               extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if(extraRoadAddr !== ''){
                 extraRoadAddr = ' (' + extraRoadAddr + ')';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.

            document.getElementById("userAddress").value = roadAddr;
            

            var guideTextBox = document.getElementById("guide");
            
        }
    }).open();
};


// 전화번호 부분:

// 인증 요청을 눌렀을 때 아래에 한 칸이 더 생기면서 타이머 가동(5분)
function addInput() {
    // Reset previous inputs
    resetInputs();

    // Create a container div
    var containerDiv = document.createElement('div');
    containerDiv.style.display = 'flex';
    containerDiv.style.alignItems = 'center';

    // Create new email input field
    var newInput = document.createElement('input');
    newInput.type = 'email';
    newInput.placeholder = '인증번호 입력';
    newInput.style.width = '70%';
    newInput.style.padding = '40px 5px 10px';
    newInput.style.backgroundColor = 'transparent';
    newInput.style.border = 'none';
    newInput.style.borderBottom = '1px solid #B4B4B4';
    newInput.style.fontSize = '16px';
    newInput.style.color = '#0ECFFF';
    newInput.style.outline = 'none';
    newInput.style.maxWidth = '210px';

    // Create timer element
    var timerElement = document.createElement('span');
    timerElement.textContent = '5:00';
    timerElement.style.marginLeft = '10px';
    timerElement.style.color = '#B4B4B4';
    timerElement.style.fontSize = '14px';
    timerElement.style.marginTop = '30px';



    // Append input field and timer to container div
    containerDiv.appendChild(newInput);
    containerDiv.appendChild(timerElement);

    // Insert the container div after the element with the id 'EmailEX'
    var signUpEmailDiv = document.getElementById('EmailEX');
    signUpEmailDiv.insertAdjacentElement('afterend', containerDiv);

    // Start the timer countdown
    var timer = 5 * 60; // 5 minutes in seconds
    timerInterval = setInterval(function() {
    var minutes = Math.floor(timer / 60);
    var seconds = timer % 60;

    // Display the timer value in format MM:SS
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Decrease timer by 1 second
    timer--;

    // If timer reaches 0, clear the interval
    if (timer < 0) {
        clearInterval(timerInterval);
    // You can add additional actions when the timer reaches 0 here
    }
    }, 1000); // Update timer every second
};


// 회원가입 버튼 부분:

// 회원가입 버튼을 눌렀을 때 모든 값이 채워져있으면 회원가입 성공, 그렇지 않으면 실패
document.getElementById('RegisterSubmit').addEventListener('click', (event) => {
    event.preventDefault();

    // 모든 input 요소를 가져옴
    const inputs = document.querySelectorAll('input');
    let allInputsFilled = true;

    // 모든 input 요소에 대해 값이 있는지 확인
    inputs.forEach(input => {
        if (!input.value.trim()) { // 값이 비어 있는지 확인
            allInputsFilled = false;
            return;
        }
    });

    // 모든 input 요소에 값이 입력되어 있을 때만 모달 창을 보이게 함
    if (allInputsFilled) {
        const modal = document.getElementById('modal');
        modal.style.display = 'block';

        // 확인 버튼 클릭 시 모달 창 닫고 index.html로 이동
        document.getElementById('modalCloseButton').addEventListener('click', () => {
            modal.style.display = 'none';
            window.location.href = 'index.html';
        });
    } else {
        // 값이 입력되지 않은 input이 있을 경우에는 아무 동작도 하지 않음
        console.log('Please fill in all fields.');
    }
});

var timerInterval; // 변수를 미리 정의합니다.

function resetInputs() {
    // Clear previous timer interval if it exists
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Remove the container div containing the input and timer
    var containerDiv = document.querySelector('#EmailEX + div');
    if (containerDiv) {
        containerDiv.parentElement.removeChild(containerDiv);
    }
};


// 클린잇 소식 받기 버튼 부분:

// 버튼을 클릭하면 동그라미가 오른쪽으로 움직이고 배경색은 하늘색으로 변경.
var isBackgroundChanged = false; 
    function toggleBackground() {
        var button = document.querySelector('.custom-button');
        var circleIcon = document.querySelector('.circle-icon');
        
            if (!isBackgroundChanged) {
                button.style.backgroundColor = '#2FD8FF'; // Change to the new color
                circleIcon.style.right = '5px'; // Move circle-icon to the right
                requestToken();
            } else {
                button.style.backgroundColor = '#FFFFFF'; // Revert to the original color
                circleIcon.style.right = '40px'; // Move circle-icon back to its original position
                deleteToken();
            }
        
                isBackgroundChanged = !isBackgroundChanged;
};