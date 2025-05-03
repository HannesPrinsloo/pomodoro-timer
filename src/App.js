import React, { useState, useEffect, useRef } from "react";
import './App.css';

const secondsToDisplay = (secs) => {
  let minutes = Math.floor(secs / 60).toString();
  let seconds = (secs % 60).toString();
  
  if (minutes.length < 2) {
   const addZero = ["0",...minutes].join('');
   minutes = addZero;
  }

  if (seconds.length < 2) {
    const addZero = ["0",...seconds].join('');
    seconds = addZero;
   }

  const displayTime = `${minutes}:${seconds}`;
  return displayTime;
};
const displayTime = secondsToDisplay(1530);
console.log("displayTime", displayTime);

const TimerApp = () => {
  const [sessionTime, setSessionTime] = useState(1500);
  const [breakTime, setBreakTime] = useState(300);
  const [currentTime, setCurrentTime] = useState(1500); // Initial time in seconds
  const [timerState, setTimerState] = useState("paused");
  const [timerType, setTimerType] = useState("Session"); 

  const audioRef = useRef(null);

  const reset = () => {
    setSessionTime(1500);
    setBreakTime(300);
    setCurrentTime(1500);
    setTimerState("paused");
    setTimerType("Session");
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handlePlayPause = (event) => {
    const value = event.target.value;
    console.log("handlePlayPause event.target.value⌚⏯", value);

    if (timerState === "paused") {
      setTimerState("running");
    } else {
      setTimerState("paused");
    }
  };
  //================================ 🔻🔻 useEffect🔻🔻 ================================//
  useEffect(() => {
    let intervalId = null;
    if(timerState === "running") {
      intervalId = setInterval(() => {
        setCurrentTime(prev => prev - 1);
        if (currentTime === 1) {
          audioRef.current.play();
        };
        if (currentTime === 0) {
          if (timerType === "Session") {
            setTimerType("Break");
            setCurrentTime(breakTime);
          } else {
            setTimerType("Session");
            setCurrentTime(sessionTime);
          }
        };
      }, 1000);
    };
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Interval cleared:", intervalId);
      }
    }
  }, [timerState, currentTime, breakTime, sessionTime, timerType]);

  const onDecrement = (event) => {
    const value = event.target.value;
    console.log("onDecrement Value👇", value);

    if (value === "Break-down" && breakTime > 60 && timerState === "paused") {
      setBreakTime(breakTime - 60);
      if (timerType === "Break") {
        setCurrentTime(breakTime - 60);
      }
      console.log("breakTime - 60", breakTime - 60);
    } else if (value === "Session-down" && sessionTime > 60 && timerState === "paused") {
      setSessionTime(sessionTime - 60);
      console.log(sessionTime - 60);
      if (timerType === "Session") {
        setCurrentTime(sessionTime - 60);
      }
    }
  };

  const onIncrement = (event) => {
    const value = event.target.value;
    console.log("onIncrement Value👆", value);

    if (value === "Break-up" && breakTime < 3600 && timerState === "paused") {
      setBreakTime(breakTime + 60);
      if (timerType === "Break") {
        setCurrentTime(breakTime + 60);
      }
    } else if (value === "Session-up" && sessionTime < 3600 && timerState === "paused") {
      setSessionTime(sessionTime + 60);
      if (timerType === "Session") {
        setCurrentTime(sessionTime + 60);
      }
    }
  };
  return (
    <div>
      <LengthControl 
        session="Session"
        time={sessionTime}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
      />
      <LengthControl 
        session="Break"
        time={breakTime}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
      />
      <TimerDisplay 
        currentTime={currentTime}
        timerState={timerState}
        timerType={timerType}
      />
      <Controls 
        reset={reset}
        timerState={timerState}
        handlePlayPause={handlePlayPause}
      />
      <audio id="beep" ref={audioRef} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
    </div>
  );
};

const LengthControl = ({session, time, onDecrement, onIncrement}) => {
const sessionForId = session.toLowerCase();
  return (
    <div id={`${sessionForId}-details`}>
        <div id={`${sessionForId}-label`}>{session}</div>
        <div><button id={`${sessionForId}-decrement`} className="fa fa-arrow-down" onClick={onDecrement} value={`${session}-down`}></button></div>
        <div id={`${sessionForId}-length`}>{time / 60}</div>
        <div><button id={`${sessionForId}-increment`} className="fa fa-arrow-up"  onClick={onIncrement} value={`${session}-up`}></button></div>
      </div>
  );
};

const TimerDisplay = ({currentTime, timerState, timerType}) => {

  
  return (
    <div id="timer">
        <div id="timer-label">{timerType}</div>
        <div id="time-left">{secondsToDisplay(currentTime)}</div>
    </div>
  );
};

const Controls = ({reset, timerState, handlePlayPause}) => {

  return (
    <div id="controls">
          <div><button  id="start_stop" onClick={handlePlayPause} value="play-pause">{timerState === "paused" ? "Play" : "Pause"}</button></div>
          <div><button id="reset" onClick={reset} value="reset">Reset</button></div>
        </div>
  );
};

export default TimerApp;