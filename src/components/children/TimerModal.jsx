import { useState, useEffect } from "react";
import "./TimerModal.scss";
import LogoWithText from "../../assets/images/logo-with-text.png"

const TimerModal = ({ onClose, onFinish }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [formatedTime, setFormatedTime] = useState({
    sec: 0,
    min: 0,
  });

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // const formatTime = (seconds) => {
  //   const min = Math.floor(seconds / 60);
  //   const sec = seconds % 60;

  //   return `${min}:${sec.toString().padStart(2, "0")}`;
  // };

  useEffect(() => {
    setFormatedTime({
      min: Math.floor(elapsedTime / 60),
      sec: `${(elapsedTime % 60).toString().padStart(2, "0")}`,
    });
  }, [elapsedTime]);

  return (
    <div className="modal-backdrop timer-component">
      <div className="modal timer-item">
        <img className="timer-logo" src={LogoWithText} alt="logo with text" />
        <h3 className="timer-title">Mycie zębów</h3>
        <p className="timer-info">
          żeby otrzymać puchar myjemy zęby minimum dwie minuty
        </p>
        <div className="timer-wraper">
          <p className="timer">
            <span className="minutes">{formatedTime.min}</span>:
            <span className={`seconds ${isRunning ? "running" : ""}`}>
              {formatedTime.sec}
            </span>
          </p>
          {/* <p>{formatTime(elapsedTime)}</p> */}
        </div>
        <div className="modal-btns">
          <button
            className="start-btn"
            disabled={isRunning}
            onClick={() => setIsRunning(true)}
          >
            Start
          </button>
          <button
            className="stop-btn"
            disabled={!isRunning}
            onClick={() => {
              setIsRunning(false);
              onFinish(elapsedTime);
            }}
          >
            Stop
          </button>
          <button
            className="close-btn"
            onClick={() => {setIsRunning(false); onClose()}}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerModal;
