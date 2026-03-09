import { useState, useEffect } from "react";
import "./TimerModal.scss";
import AppImage from "../../styles/AppImage";
import { Doughnut } from "react-chartjs-2";
import Confetti from "react-confetti";
import "chart.js/auto";
import LogoWithText from "../../assets/images/logo-with-text.png";

const TimerModal = ({ onClose, onFinish }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [formatedTime, setFormatedTime] = useState({
    sec: 0,
    min: 0,
  });
  const [chartData, setChartData] = useState({
    datasets: [
      {
        data: [0, 100], // Startujemy od zera
        backgroundColor: ["#4bc0c0", "#e0e0e0"],
        cutout: "80%",
        borderWidth: 0,
        borderRadius: 10,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // rotation: -90, // start od góry
    animation: {
      duration: 1000, // Animacja trwa tyle, co odliczanie (10s)
      easing: "linear", // "linear" sprawi, że będzie płynnie "jechać"
      animateRotate: true,
    },
    plugins: { legend: { display: false } },
  };

  useEffect(() => {
    const totalTime = 120; // 2 minuty

    const progress = Math.min((elapsedTime / totalTime) * 100, 100);

    const color = elapsedTime >= 60 ? "#36a2eb" : "#ff4d4d";

    if (elapsedTime >= totalTime) {
      setShowConfetti(true);
    }

    setChartData({
      datasets: [
        {
          data: [progress, 100 - progress],
          backgroundColor: [color, "#e0e0e0"],
          cutout: "80%",
          borderWidth: 0,
          
        },
      ],
    });
  }, [elapsedTime]);

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
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="modal timer-item">
        <div className="timer-wraper">
          <Doughnut
            className="doughnut-chart"
            options={options}
            data={chartData}
          />
          <AppImage src={LogoWithText} alt="Logo Smile" className="logo" />

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
            onClick={() => {
              setIsRunning(false);
              onClose();
            }}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerModal;
