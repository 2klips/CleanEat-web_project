
const buttons = document.querySelectorAll('.custom-button');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('active'); 
    });
});