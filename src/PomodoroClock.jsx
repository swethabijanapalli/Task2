import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./PomodoroClock.css";

const PomodoroClock = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            // Switch to break or end cycle
            if (isBreak) {
              // End break and start new cycle
              setIsBreak(false);
              setMinutes(25);
            } else {
              // Start break
              setIsBreak(true);
              setMinutes(5);
              // Decrease cycle count
              setCycles(cycles - 1);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, isBreak, cycles]);

  const startTimer = () => {
    if (cycles === 0) {
      return;
    }
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
    setCycles(0);
  };

  useEffect(() => {
    if (cycles === 0) {
      setIsRunning(false);
    }
  }, [cycles]);

  const progressBarValue =
    ((minutes * 60 + seconds) / (isBreak ? 300 : 1500)) * 100;

  return (
    <div>
      <h1>Pomodoro Clock</h1>
      <div className="limit">
        <p>Cycle Limit : </p>
        <input
          type="text"
          placeholder="enter the value"
          value={cycles}
          onChange={(e) => setCycles(e.target.value)}
          disabled={isRunning}
        />
      </div>
      <div className="time">
        <p>{isBreak ? "Break" : "Work"}</p>
        <div style={{ width: "200px", position: "relative", left: "20%" }}>
          <CircularProgressbar
            value={progressBarValue}
            text={`${minutes}:${seconds.toString().padStart(2, "0")}`}
          />
        </div>
        <p>Cycles Left: {cycles}</p>
      </div>
      <div>
        {!isRunning && (
          <button onClick={startTimer} disabled={cycles === 0}>
            Start
          </button>
        )}
        {isRunning && <button onClick={stopTimer}>Stop</button>}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default PomodoroClock;
