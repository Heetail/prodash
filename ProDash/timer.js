// Timer & Stopwatch Module
const TimerApp = (() => {
    const timerModeBtn = document.getElementById('timerModeBtn');
    const stopwatchModeBtn = document.getElementById('stopwatchModeBtn');
    const timerMode = document.getElementById('timerMode');
    const stopwatchMode = document.getElementById('stopwatchMode');

    // Timer variables
    let timerInterval = null;
    let timerRunning = false;
    let timeRemaining = 0;

    // Stopwatch variables
    let stopwatchInterval = null;
    let stopwatchRunning = false;
    let elapsedTime = 0;
    let laps = [];

    // Timer functions
    const startTimer = () => {
        const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
        
        if (minutes === 0 && seconds === 0) {
            alert('Please enter time');
            return;
        }

        timeRemaining = minutes * 60 + seconds;
        timerRunning = true;
        document.getElementById('startTimerBtn').style.display = 'none';
        document.getElementById('pauseTimerBtn').style.display = 'block';
        document.getElementById('timerMinutes').disabled = true;
        document.getElementById('timerSeconds').disabled = true;

        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                alert('Time\'s up!');
                resetTimer();
            }
        }, 1000);
    };

    const pauseTimer = () => {
        timerRunning = false;
        clearInterval(timerInterval);
        document.getElementById('startTimerBtn').style.display = 'block';
        document.getElementById('pauseTimerBtn').style.display = 'none';
    };

    const resetTimer = () => {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById('timerMinutes').value = '';
        document.getElementById('timerSeconds').value = '';
        document.getElementById('timerMinutes').disabled = false;
        document.getElementById('timerSeconds').disabled = false;
        document.getElementById('startTimerBtn').style.display = 'block';
        document.getElementById('pauseTimerBtn').style.display = 'none';
        timeRemaining = 0;
    };

    const updateTimerDisplay = () => {
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        document.getElementById('timerMinutes').value = String(mins).padStart(2, '0');
        document.getElementById('timerSeconds').value = String(secs).padStart(2, '0');
    };

    // Stopwatch functions
    const startStopwatch = () => {
        stopwatchRunning = true;
        document.getElementById('startStopwatchBtn').style.display = 'none';
        document.getElementById('pauseStopwatchBtn').style.display = 'block';

        stopwatchInterval = setInterval(() => {
            elapsedTime++;
            updateStopwatchDisplay();
        }, 1000);
    };

    const pauseStopwatch = () => {
        stopwatchRunning = false;
        clearInterval(stopwatchInterval);
        document.getElementById('startStopwatchBtn').style.display = 'block';
        document.getElementById('pauseStopwatchBtn').style.display = 'none';
    };

    const resetStopwatch = () => {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        elapsedTime = 0;
        laps = [];
        updateStopwatchDisplay();
        document.getElementById('startStopwatchBtn').style.display = 'block';
        document.getElementById('pauseStopwatchBtn').style.display = 'none';
        renderLaps();
    };

    const updateStopwatchDisplay = () => {
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;
        
        document.getElementById('stopwatchDisplay').textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const addLap = () => {
        if (stopwatchRunning || elapsedTime > 0) {
            laps.push(elapsedTime);
            renderLaps();
        }
    };

    const renderLaps = () => {
        const lapsList = document.getElementById('lapsList');
        lapsList.innerHTML = laps.map((lap, index) => {
            const hours = Math.floor(lap / 3600);
            const minutes = Math.floor((lap % 3600) / 60);
            const seconds = lap % 60;
            const lapTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            return `<li><strong>Lap ${index + 1}</strong> <span>${lapTime}</span></li>`;
        }).join('');
    };

    const setupEventListeners = () => {
        // Mode switching
        timerModeBtn.addEventListener('click', () => {
            timerModeBtn.classList.add('active');
            stopwatchModeBtn.classList.remove('active');
            timerMode.style.display = 'block';
            stopwatchMode.style.display = 'none';
        });

        stopwatchModeBtn.addEventListener('click', () => {
            stopwatchModeBtn.classList.add('active');
            timerModeBtn.classList.remove('active');
            timerMode.style.display = 'none';
            stopwatchMode.style.display = 'block';
        });

        // Timer buttons
        document.getElementById('startTimerBtn').addEventListener('click', startTimer);
        document.getElementById('pauseTimerBtn').addEventListener('click', pauseTimer);
        document.getElementById('resetTimerBtn').addEventListener('click', resetTimer);

        // Stopwatch buttons
        document.getElementById('startStopwatchBtn').addEventListener('click', startStopwatch);
        document.getElementById('pauseStopwatchBtn').addEventListener('click', pauseStopwatch);
        document.getElementById('resetStopwatchBtn').addEventListener('click', resetStopwatch);
    };

    return {
        init: () => {
            setupEventListeners();
            updateStopwatchDisplay();
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    TimerApp.init();
});
