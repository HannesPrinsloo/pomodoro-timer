import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // Assuming ReactDOM is available in your environment

// Helper function (can be outside the component)
const addZeroes = (num, size = 2) => {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

// Helper function (can be outside the component)
const numberToTime = (totalSeconds) => {
  const minutes = addZeroes(Math.floor(totalSeconds / 60));
  const seconds = addZeroes(totalSeconds % 60); // Simpler calculation for seconds
  return `${minutes}:${seconds}`;
};

// Functional Component for displaying the current timer and label
const CurrentTimer = ({ currentTimer, timerType, audioRef }) => {
  return (
    <div className="card-body">
      <h6 className="card-title text-secondary fs-2 fw-bold" id="timer-label">
        {timerType}
      </h6>
      <h5 className="card-title text-light fs-1 fw-bold" id="time-left">
        {currentTimer}
      </h5>
      {/* Audio element is now controlled via ref in the parent */}
       <audio id="beep" ref={audioRef}>
         <source src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
       </audio>
    </div>
  );
};

// Functional Component for Control Buttons
const ControlButtons = ({ reset, playpause }) => {
  return (
    <div
      className="mx-auto btn-group card-body text-center w-50"
      role="group"
      id="control-buttons"
    >
      <button
        className="btn btn-outline-primary"
        id="start_stop"
        onClick={playpause}
      >
        <i className="fa-solid fa-play"></i> {/* Consider changing icon based on timerState */}
      </button>
      <button className="btn btn-outline-primary" id="reset" onClick={reset}>
        <i className="fa-solid fa-stop"></i>
      </button>
    </div>
  );
};

// Functional Component for Settings
const Settings = ({ currentSessionTime, currentBreakTime, handleSettings }) => {
  return (
    <div className="card-body">
      <div className="btn-group-vertical" role="group">
        <button
          className="btn btn-primary"
          aria-disabled="true"
          id="session-label"
        >
          Session Time:
        </button>
        <button
          className="btn btn-primary"
          aria-disabled="true"
          id="session-length"
        >
          {currentSessionTime}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          id="session-increment"
          onClick={handleSettings}
          value="+"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          id="session-decrement"
          onClick={handleSettings}
          value="-"
        >
          <span>
            <i className="fa-solid fa-minus"></i>
          </span>
        </button>
      </div>
      <div className="btn-group-vertical" role="group" id="break-group">
        <button
          className="btn btn-primary"
          aria-disabled="true"
          id="break-label"
        >
          Break Time:
        </button>
        <button
          className="btn btn-primary"
          aria-disabled="true"
          id="break-length"
        >
          {currentBreakTime}
        </button>
        <button
          className="btn btn-outline-secondary"
          id="break-increment"
          onClick={handleSettings}
          value="+"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
        <button
          className="btn btn-outline-secondary"
          id="break-decrement"
          onClick={handleSettings}
          value="-"
        >
          <i className="fa-solid fa-minus"></i>
        </button>
      </div>
    </div>
  );
};

// Main Pomodoro Functional Component using Hooks
const Pomodoro = () => {
  // State using useState hook
  const [sessionTime, setSessionTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [currentTime, setCurrentTime] = useState(25 * 60); // Initial time in seconds
  const [timerState, setTimerState] = useState("stopped");
  const [timerType, setTimerType] = useState("Session");

  // Ref to hold the interval ID
  const intervalRef = useRef(null);
  // Ref to hold the audio element
  const audioRef = useRef(null);

  // Effect to manage the timer interval
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        // Use functional update for currentTime to avoid stale state
        setCurrentTime(prevTime => prevTime - 1);
      }, 1000);
    } else {
      // Clear interval if timerState is not 'running'
      clearInterval(intervalRef.current);
    }

    // Cleanup function to clear the interval when the component unmounts
    // or when timerState changes (and the interval is stopped/paused)
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [timerState]); // Re-run effect only when timerState changes

  // Effect to handle actions when currentTime reaches zero
  useEffect(() => {
    if (currentTime < 0) {
      playAudio(); // Play sound

      if (timerType === 'Session') {
        setTimerType('Break');
        setCurrentTime(breakTime * 60); // Start break time
      } else {
        setTimerType('Session');
        setCurrentTime(sessionTime * 60); // Start session time
      }
    }
  }, [currentTime, timerType, sessionTime, breakTime]); // Re-run effect when these values change

  // Function to play the audio
  const playAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0; // Rewind to start
      audio.play().catch(error => {
         // Handle potential play errors (e.g., user hasn't interacted yet)
         console.error("Audio playback failed:", error);
      });
    }
  };

  // Function to handle session and break time settings
  const handleSettings = (e) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;

    // Only allow adjustments when the timer is stopped
    if (timerState === "stopped") {
      if (/break/gi.test(id)) {
        if (value === "-" && breakTime > 1) {
          setBreakTime(prevTime => prevTime - 1);
        } else if (value === "+" && breakTime < 60) {
          setBreakTime(prevTime => prevTime + 1);
        }
      } else if (/session/gi.test(id)) {
        if (value === "-" && sessionTime > 1) {
          setSessionTime(prevTime => prevTime - 1);
          setCurrentTime(prevTime => prevTime - 60); // Update current time accordingly
        } else if (value === "+" && sessionTime < 60) {
          setSessionTime(prevTime => prevTime + 1);
          setCurrentTime(prevTime => prevTime + 60); // Update current time accordingly
        }
      }
    }
  };

  // Function to toggle between play and pause
  const playpause = () => {
    if (timerState === "stopped" || timerState === "paused") {
      setTimerState("running");
    } else { // timerState === "running"
      setTimerState("paused");
    }
  };

  // Function to reset the timer
  const reset = () => {
    // Clear any running interval
    clearInterval(intervalRef.current);

    // Pause and reset audio
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // Reset all state variables to initial values
    setTimerType("Session");
    setTimerState("stopped");
    setSessionTime(25);
    setBreakTime(5);
    setCurrentTime(25 * 60); // Reset to default session time in seconds
  };

  return (
    <div>
      <CurrentTimer
        currentTimer={numberToTime(currentTime)} // Pass formatted time
        timerType={timerType}
        audioRef={audioRef} // Pass audio ref down
      />
      <ControlButtons reset={reset} playpause={playpause} />
      <Settings
        currentSessionTime={sessionTime}
        currentBreakTime={breakTime}
        handleSettings={handleSettings}
      />
    </div>
  );
};

// Render the main component (assuming a div with id="react-container" exists)
ReactDOM.render(<Pomodoro />, document.getElementById("react-container"));