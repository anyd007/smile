import { useState, useEffect } from "react";
import "./Draw.scss";

const Draw = ({ drawList }) => {
  const [drawNames, setDrawNames] = useState([]);
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  // DODANE: Stan do kontrolowania fizycznego przesunięcia w pikselach
  const [offset, setOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const ITEM_HEIGHT = 80; // Stała wysokość jednego wiersza (musi być taka sama jak w CSS)

  useEffect(() => {
    // Przygotowujemy listę imion
    setDrawNames(drawList.map((child) => child.name));
  }, [drawList]);

  const handleDraw = () => {
    if (isRolling || drawNames.length === 0) return;

    setIsRolling(true);

    // 1. Losujemy indeks zwycięzcy
    const randomIndex = Math.floor(Math.random() * drawNames.length);

    // 2. OBLICZENIA DLA WIELU LOSOWAŃ:
    // Musimy wiedzieć, gdzie jesteśmy teraz (currentIteration)
    // i dodać do tego duży dystans, żeby zawsze kręciło się "do przodu"
    const spins = 10; // Ile pełnych obrotów przy każdym kliknięciu

    // Obliczamy nowy offset dodając do obecnego offsetu
    // dystans potrzebny do kolejnych pełnych obrotów + wyrównanie do zwycięzcy
    const currentFullSpinsOffset =
      Math.ceil(offset / (drawNames.length * ITEM_HEIGHT)) *
      (drawNames.length * ITEM_HEIGHT);
    const newOffset =
      currentFullSpinsOffset +
      spins * drawNames.length * ITEM_HEIGHT +
      randomIndex * ITEM_HEIGHT;

    setWinnerIndex(randomIndex);
    setOffset(newOffset);

    setTimeout(() => {
    setIsRolling(false);

    // --- KLUCZOWY TRIK ---
    // Po zakończeniu losowania, "teleportujemy" listę na początkową pozycję 
    // tego samego imienia, ale bez animacji.
    // Dzięki temu przy następnym kliknięciu zawsze startujemy z dołu.
    
    // Musisz dodać stan dla CSS transition: const [transitionEnabled, setTransitionEnabled] = useState(true);
    setTransitionEnabled(false); 
    setOffset(randomIndex * ITEM_HEIGHT);
    
    // Przywracamy animację krótko po teleportacji
    setTimeout(() => setTransitionEnabled(true), 50);
  }, 3500);
  };

  return (
    <div className="draw-component">
      <h2>Kto pierwszy myje zęby?</h2>

      <div className="draw-item">
        <div
          className="draw-list"
          style={{
            // Przesuwamy listę w górę o wyliczony offset
            transform: `translateY(-${offset}px)`,
            transition: transitionEnabled
              ? "transform 3.5s cubic-bezier(0.1, 0, 0.1, 1)"
              : "none", // Wyłączamy animację na czas teleportacji
          }}
        >
          {/* Renderujemy listę wiele razy pod rząd, żeby stworzyć efekt nieskończonej taśmy */}
          {[...Array(40)].map((_, i) =>
            drawNames.map((name, index) => <p key={`${i}-${index}`}>{name}</p>),
          )}
        </div>
      </div>

      <button onClick={handleDraw} disabled={isRolling}>
        {isRolling ? "Losowanie..." : "START! 🚀"}
      </button>

      {!isRolling && offset > 0 && (
        <h3 className="winner-announcement">
          Dzisiaj pierwszy myje: <span>{drawNames[winnerIndex]}</span>!
        </h3>
      )}
    </div>
  );
};

export default Draw;
