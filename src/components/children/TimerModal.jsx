import { useState, useEffect } from "react";
import "./TimerModal.scss";
import AppImage from "../../styles/AppImage";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import LogoWithText from "../../assets/images/logo-with-text.png";

const TimerModal = ({ onClose, onFinish }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [formatedTime, setFormatedTime] = useState({
    sec: 0,
    min: 0,
  });
  const [animationDuration, setAnimationDuration] = useState(500); // Szybki start 
  const [chartData, setChartData] = useState({
    datasets: [{
      data: [0, 100], // Startujemy od zera
      backgroundColor: ['#4bc0c0', '#e0e0e0'],
      cutout: '80%',
      borderWidth: 0,
    }],
  });

   const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: animationDuration, // Animacja trwa tyle, co odliczanie (10s)
      easing: "linear",           // "linear" sprawi, że będzie płynnie "jechać"
      animateRotate: true,
    },
    plugins: { legend: { display: false } },
  };


  useEffect(() => {
    if (!isRunning) return;

    setAnimationDuration(120 * 1000);

    setChartData({
      datasets: [{
        data: [100, 0], // Nowe wartości, do których wykres "dopłynie"
        backgroundColor: ['#4bc0c0', '#e0e0e0'],
        cutout: '80%',
      }],
    });

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
        <div className="timer-wraper">
          <Doughnut className="doughnut-chart" options={options} data={chartData} />
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
