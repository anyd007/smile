import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import animacji
import "./SessionsTable.scss";

function SessionsTable({ sessions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!sessions?.length) return <p className="empty-msg">Zacznij przygodę! 🪥</p>;

  const bestTime = Math.max(...sessions.map((s) => s.duration));
  const sortedSessions = [...sessions].sort((a, b) => 
    (b.createdAt?.toDate?.() || b._localCreatedAt) - (a.createdAt?.toDate?.() || a._localCreatedAt)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedSessions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sessions.length / itemsPerPage);

  // Definicja animacji dla kart
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 } // Karty pojawiają się jedna po drugiej
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="sessions-wrapper">
      {/* AnimatePresence pozwala animować znikanie elementów */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentPage} // Kluczowe: animacja odpali się przy zmianie strony
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, x: -20 }}
          className="adventure-grid"
        >
          {currentItems.map((s) => (
            <motion.div 
              key={s.id} 
              variants={cardVariants}
              className={`session-card ${s.duration < 120 ? "short" : "success"}`}
            >
              <div className="card-top">
                <span className="date-tag">{(s.createdAt?.toDate?.() ?? s._localCreatedAt)?.toLocaleDateString()}</span>
                {s.duration === bestTime && <span className="record-badge">⏱️</span>}
              </div>
              <div className="card-body">
                <div className="status-icon">{s.success ? "🏆" : "🦷"}</div>
                <div className="duration-val">{Math.floor(s.duration / 60)}:{(s.duration % 60).toString().padStart(2, "0")}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="pag-btn">⬅️</button>
          <span className="page-info">Strona <strong>{currentPage}</strong> z {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="pag-btn">➡️</button>
        </div>
      )}
    </div>
  );
}

export default SessionsTable;
