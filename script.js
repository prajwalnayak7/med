let timer;
let isPaused = false;
let timeLeft = 0; // Time left in seconds, initialized based on user input
let endAudio = new Audio('bell.mp3');

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const stopBtn = document.getElementById('stop-btn');
const audioInput = document.getElementById('audio-file');

// Convert time in HH:MM:SS format to seconds
function parseTimeString(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        return null;
    }
    return (hours * 3600) + (minutes * 60) + seconds;
}

// Update the display with the remaining time in HH:MM:SS format
function updateDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Enforce proper time format while typing
function enforceTimeFormat(event) {
    let timeString = timerDisplay.textContent.replace(/[^\d]/g, ""); // Remove non-digits
    timeString = timeString.slice(0, 6); // Limit to max 6 digits

    if (timeString.length <= 2) {
        timerDisplay.textContent = timeString;
    } else if (timeString.length <= 4) {
        timerDisplay.textContent = timeString.slice(0, 2) + ':' + timeString.slice(2);
    } else {
        timerDisplay.textContent = timeString.slice(0, 2) + ':' + timeString.slice(2, 4) + ':' + timeString.slice(4);
    }
    setCaretPosition(timerDisplay, timerDisplay.textContent.length);
}

// Set caret position in the contenteditable div
function setCaretPosition(element, position) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(element.childNodes[0], position);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

// Start the timer
function startTimer() {
    console.log('Start button clicked');
    enforceTimeFormat(); // Make sure the format is correct before starting

    timeLeft = parseTimeString(timerDisplay.textContent);
    console.log('Parsed timeLeft:', timeLeft);

    if (timeLeft === null || timeLeft <= 0) {
        alert("Please enter a valid duration in HH:MM:SS format.");
        return;
    }

    isPaused = false;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline';
    stopBtn.style.display = 'inline';

    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                const audio = endAudio.cloneNode();
                audio.play();
                setTimeout(() => audio.pause(), 60);
                alert("Time's up!");
                resetTimer();
            }
        }
    }, 1000);
}

// Pause the timer
function pauseTimer() {
    isPaused = true;
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'inline';
}

// Resume the timer
function resumeTimer() {
    isPaused = false;
    resumeBtn.style.display = 'none';
    pauseBtn.style.display = 'inline';
}

// Stop the timer
function stopTimer() {
    clearInterval(timer);
    resetTimer();
}

// Reset the timer to the initial state
function resetTimer() {
    timeLeft = 0;
    isPaused = false;
    startBtn.style.display = 'inline';
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    timerDisplay.textContent = '00:00:00'; // Default time display
}

// Validate input to restrict unwanted characters
function validateInput(event) {
    const key = event.key;
    if (!/[\d]/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
        event.preventDefault();
    }
}

// Update end audio if a file is selected
audioInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        endAudio = new Audio(URL.createObjectURL(file));
    }
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resumeBtn.addEventListener('click', resumeTimer);
stopBtn.addEventListener('click', stopTimer);
timerDisplay.addEventListener('input', enforceTimeFormat); // Enforce format on input
timerDisplay.addEventListener('keydown', validateInput); // Restrict unwanted characters

updateDisplay(); // Initial display update

