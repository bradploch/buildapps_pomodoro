let timeLeft = 45 * 60; // 45 minutes in seconds
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const workModeBtn = document.getElementById('work-mode');
const restModeBtn = document.getElementById('rest-mode');
const heading = document.getElementById('main-heading');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                alert('Timer Complete!');
                startPauseButton.textContent = 'Start';
                startPauseButton.dataset.state = 'start';
            }
        }, 1000);
        startPauseButton.textContent = 'Pause';
        startPauseButton.dataset.state = 'pause';
    } else {
        clearInterval(timerId);
        timerId = null;
        startPauseButton.textContent = 'Start';
        startPauseButton.dataset.state = 'start';
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkTime ? 45 * 60 : 10 * 60;
    updateDisplay();
    startPauseButton.textContent = 'Start';
    startPauseButton.dataset.state = 'start';
}

function setWorkMode() {
    console.log('Work mode activated'); // Debug log
    isWorkTime = true;
    timeLeft = 45 * 60;
    workModeBtn.classList.add('active');
    restModeBtn.classList.remove('active');
    heading.textContent = 'WORK HARDER';
    updateDisplay();
}

function setRestMode() {
    console.log('Rest mode activated'); // Debug log
    isWorkTime = false;
    timeLeft = 10 * 60;
    restModeBtn.classList.add('active');
    workModeBtn.classList.remove('active');
    heading.textContent = 'Enjoy your Rest 💆';
    updateDisplay();
}

startPauseButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
workModeBtn.addEventListener('click', setWorkMode);
restModeBtn.addEventListener('click', setRestMode);

// Initialize work mode
setWorkMode(); 