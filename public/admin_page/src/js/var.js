
export function timeNow() {
    setInterval(() => {
        const now = new Date();
        const calendarElement = document.getElementById('calendar');
        if (calendarElement) {
            calendarElement.innerHTML = `
                <div>
                    ${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}
                </div>
            `;
        }
    }, 1000);
}


export function Daycalculate(){
    const Now = new Date();
    const yearNow = Now.getFullYear();
    const dayNow = Now.getDate();
    const MonthNow = Now.getMonth();
    
    const prevLast = new Date(yearNow, MonthNow, 0).getDate();
    const thisLast = new Date(yearNow, MonthNow + 1, 0).getDate();

}