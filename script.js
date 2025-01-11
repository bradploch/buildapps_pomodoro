let timeLeft = 45 * 60; // 45 minutes in seconds
let timerId = null;
let isWorkTime = true;
let sessionStartTime = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const workModeBtn = document.getElementById('work-mode');
const restModeBtn = document.getElementById('rest-mode');
const heading = document.getElementById('main-heading');
const container = document.querySelector('.container');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (minutes === 0) {
        return `${seconds} seconds`;
    } else if (seconds === 0) {
        return `${minutes} minutes`;
    } else {
        return `${minutes} minutes and ${seconds} seconds`;
    }
}

function createLogEntry(type, focusTask = '', duration) {
    const logContainer = document.getElementById('session-log') || (() => {
        const container = document.createElement('div');
        container.id = 'session-log';
        container.style.color = '#fff';
        container.style.marginTop = '2rem';
        container.style.textAlign = 'left';
        container.style.fontSize = '0.9rem';
        container.style.opacity = '0.8';
        document.querySelector('.container').appendChild(container);
        return container;
    })();

    const entry = document.createElement('div');
    entry.style.marginBottom = '0.5rem';
    
    const formattedTime = formatTime(duration);
    
    if (type === 'work') {
        entry.textContent = `✓ Focused on "${focusTask}" for ${formattedTime}`;
    } else {
        entry.textContent = `💆 Rested for ${formattedTime}`;
    }
    
    logContainer.insertBefore(entry, logContainer.firstChild);
}

function createCustomPrompt() {
    return new Promise((resolve) => {
        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: #1C1B22;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 0 40px rgba(138, 43, 226, 0.2);
            border: 1px solid rgba(138, 43, 226, 0.2);
            width: 90%;
            max-width: 400px;
            text-align: center;
        `;

        // Create prompt text
        const promptText = document.createElement('p');
        promptText.textContent = 'What are you focusing on?';
        promptText.style.cssText = `
            color: white;
            margin-bottom: 1.5rem;
            font-size: 1.2rem;
            font-weight: 500;
        `;

        // Create input field
        const input = document.createElement('input');
        input.style.cssText = `
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(138, 43, 226, 0.3);
            border-radius: 8px;
            background: #2D1B4E;
            color: white;
            font-size: 1rem;
            outline: none;
        `;
        input.placeholder = 'Enter your focus task...';

        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Start Focusing';
        submitButton.style.cssText = `
            background: #8a2be2;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s ease;
        `;

        // Add hover effect
        submitButton.onmouseover = () => {
            submitButton.style.transform = 'translateY(-2px)';
            submitButton.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.2)';
        };
        submitButton.onmouseout = () => {
            submitButton.style.transform = 'translateY(0)';
            submitButton.style.boxShadow = 'none';
        };

        // Handle submission
        const handleSubmit = () => {
            const value = input.value.trim();
            if (value) {
                document.body.removeChild(backdrop);
                resolve(value);
            } else {
                input.style.border = '1px solid #EF4444';
                input.placeholder = 'Please enter a focus task...';
            }
        };

        submitButton.onclick = handleSubmit;
        input.onkeypress = (e) => {
            if (e.key === 'Enter') handleSubmit();
        };

        // Assemble and show modal
        modal.appendChild(promptText);
        modal.appendChild(input);
        modal.appendChild(submitButton);
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // Focus input
        input.focus();
    });
}

async function startTimer() {
    if (timerId === null) {
        if (isWorkTime) {
            const focusTask = await createCustomPrompt();
            if (focusTask) {
                document.title = `Focus: ${focusTask}`;
                
                const existingFocus = document.getElementById('focus-display');
                if (existingFocus) {
                    existingFocus.remove();
                }
                
                const focusDisplay = document.createElement('div');
                focusDisplay.id = 'focus-display';
                focusDisplay.textContent = `🔒 Focus: ${focusTask}`;
                focusDisplay.style.color = '#fff';
                focusDisplay.style.marginTop = '1rem';
                focusDisplay.style.marginBottom = '1rem';
                focusDisplay.style.fontSize = '1.1rem';
                
                const timer = document.querySelector('.timer');
                timer.after(focusDisplay);
            }
        }
        
        sessionStartTime = timeLeft;
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                const timeSpent = sessionStartTime;
                const focusDisplay = document.getElementById('focus-display');
                const focusTask = focusDisplay ? focusDisplay.textContent.replace('🔒 Focus: ', '') : '';
                createLogEntry(isWorkTime ? 'work' : 'rest', focusTask, timeSpent);
                alert('Timer Complete!');
                startPauseButton.textContent = 'Start';
                startPauseButton.dataset.state = 'start';
            }
        }, 1000);
        startPauseButton.textContent = 'Pause';
        startPauseButton.dataset.state = 'pause';
    } else {
        // When pausing, log the session if any time was spent
        const timeSpent = sessionStartTime - timeLeft;
        if (timeSpent > 0) {
            const focusDisplay = document.getElementById('focus-display');
            const focusTask = focusDisplay ? focusDisplay.textContent.replace('🔒 Focus: ', '') : '';
            createLogEntry(isWorkTime ? 'work' : 'rest', focusTask, timeSpent);
        }
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
    console.log('Rest mode activated');
    isWorkTime = false;
    timeLeft = 10 * 60;
    restModeBtn.classList.add('active');
    workModeBtn.classList.remove('active');
    heading.textContent = 'Enjoy your Rest 💆';
    updateDisplay();
    
    const focusDisplay = document.getElementById('focus-display');
    if (focusDisplay) {
        focusDisplay.remove();
    }
    document.title = 'Pomodoro Timer';
}

startPauseButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
workModeBtn.addEventListener('click', setWorkMode);
restModeBtn.addEventListener('click', setRestMode);

// Initialize work mode
setWorkMode(); 