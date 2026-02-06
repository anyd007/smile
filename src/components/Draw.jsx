import { useState, useEffect } from "react";
import "./Draw.scss";

const Draw = ({ drawList }) => {
  const [drawNames, setDrawNames] = useState([]);
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    setDrawNames(drawList.map((child) => child.name));
  }, [drawList]);

  const handleDraw = () => {
    const randomIndex = Math.floor(Math.random() * drawNames.length);
    setWinnerIndex(randomIndex);
    setIsRolling(true);

    setTimeout(() => {
      setIsRolling(false);
    }, 3000);
  };

  return (
    <div className="draw-component">
      <h2>Kto pierwszy myje zęby</h2>
      <button onClick={handleDraw} disabled={isRolling}>
        Losowanie
      </button>

      <div className="draw-item">
        <div
          className={`draw-list ${isRolling ? "rolling" : ""}`}
          style={{
            transform: !isRolling
              ? `translateY(-${winnerIndex * 60}px)`
              : undefined,
          }}
        >
            {drawNames.map((name, index) => (
              <p className="draw-names" key={index}>{name}</p>
            ))}
        </div>
    <h3>{drawNames[winnerIndex]}</h3>
      </div>
    </div>
  );
};

export default Draw;
