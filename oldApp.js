import React, { useState, useEffect, useRef } from "react";
import './App.css';
const [minutes, seconds] = ["25", "00"];
const [breakMinutes, breakSeconds] = ["5", "00"];
const sessionOrBreak = "Session";

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
  console.log(currentTime, "currentTime")

  
    

  const handleClick = (event) => {
    console.log("event.target.value ->", event.target.value);
    const value = event.target.value;
    console.log("value", value);

    if (value === "reset") {
      setSessionTime(1500);
      setBreakTime(300);
      setCurrentTime(1500);
      setTimerState("paused");
      setTimerType("Session");
      return;
     }

   if(value === "play-pause") {
    console.log("play-pause before ->", timerState);
    if(timerState === "running") {
      setTimerState("paused");
      
    } else {
      setTimerState("running");
    }
    console.log("play-pause after ->", timerState);
    return;
   }
   

  };

  const tempTimerState = timerState;
  console.log(tempTimerState, "❗❗❗");
  if (tempTimerState === "running" && currentTime > 0) {
    setTimeout(() => {
      setCurrentTime(currentTime -1);
      console.log("currentTime🔥🔥", currentTime);
    }, 1000);
  };

  return (
    <div id="main">
      <h1>Pomodoro Timer</h1>
      <h3>25 + 5 clock</h3>
      <div id="break-details">
        <div id="break-label">BREAK</div>
        <div id="break-decrement"><button className="fa fa-arrow-down" onClick={handleClick} value="breakDown"></button></div>
        <div id="break-length">{secondsToDisplay(breakTime)}</div>
        <div id="break-increment"><button className="fa fa-arrow-up" onClick={handleClick} value="breakUp"></button></div>
      </div>
      <br></br>
      <div id="session-details">
        <div id="session-label">SESSION</div>
        <div id="session-decrement"><button className="fa fa-arrow-down" onClick={handleClick} value="sessionDown"></button></div>
        <div id="session-length">{secondsToDisplay(sessionTime)}</div>
        <div id="session-increment"><button className="fa fa-arrow-up" onClick={handleClick} value="sessionUp"></button></div>
      </div>
      <div id="timer">
        <div id="timer-label">{timerType}</div>
        <div id="time-left">{secondsToDisplay(currentTime)}</div>
        <div id="controls">
          <div id="start_stop" ><button onClick={handleClick} value="play-pause">Play/Pause</button></div>
          <div id="reset"><button onClick={handleClick} value="reset">Reset</button></div>
        </div>
      </div>
      <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
    </div>
  )
};

export default TimerApp;