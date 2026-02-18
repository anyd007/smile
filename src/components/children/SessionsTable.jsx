import { useState } from "react";
import "./SessionsTable.scss";
// import Loading from "../loading/Loading";

function SessionsTable({ sessions }) {
  const [showAll, setShowAll] = useState(false);

  if (!sessions || sessions.length === 0) {
    return <p className="empty-msg">Zacznij przygodę! Umyj zęby po raz pierwszy... 🪥</p>;
  }

  const bestTime = Math.max(...sessions.map((s) => s.duration));
  
  // Najnowsze wyniki na początku + limit wyświetlania
  const sortedSessions = [...sessions].sort((a, b) => 
    (b.createdAt?.toDate?.() || b._localCreatedAt) - (a.createdAt?.toDate?.() || a._localCreatedAt)
  );
  
  const displayedSessions = showAll ? sortedSessions : sortedSessions.slice(0, 10);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="sessions-wrapper">
      <div className="adventure-grid">
        {displayedSessions.map((s) => {
          const isRecord = s.duration === bestTime;
          const isTooShort = s.duration < 120;
          const date = (s.createdAt?.toDate?.() ?? s._localCreatedAt);

          return (
            <div key={s.id} className={`session-card ${isTooShort ? "short" : "success"}`}>
              <div className="card-top">
                <span className="date-tag">{date?.toLocaleDateString()}</span>
                {isRecord && <span className="record-badge" title="Twój rekord!">⏱️</span>}
              </div>

              <div className="card-body">
                <div className="status-icon">
                  {s.success ? "🏆" : "🦷"}
                </div>
                <div className="duration-val">{formatTime(s.duration)}</div>
              </div>

              <div className="card-footer">
                {s.success ? "Super czysto!" : "Spróbuj dłużej!"}
              </div>
            </div>
          );
        })}
      </div>

      {sessions.length > 10 && (
        <button className="load-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Pokaż mniej" : `Zobacz wszystkie sesje (${sessions.length})`}
        </button>
      )}
    </div>
  );
}

export default SessionsTable;
