import "./SessionsTable.scss";
import Loading from "../loading/Loading";
function SessionsTable({ sessions, bestTime }) {

// const bestTime = Math.max(...sessions.map(s => s.duration));
    console.log(bestTime)
  if (!sessions.length) {
    return <p>Brak zapisanych sesji</p>;
  }

   const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="table-container">
      {!sessions && <Loading/>}
      <table className="table-item">
        <thead className="table-head">
          <tr>
            <th>Data</th>
            <th>Czas</th>
            <th>Rekord czasu</th>
            <th>puchar</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr
              key={s.id}
            >
              <td>
                {(
                  s.createdAt?.toDate?.() ?? s._localCreatedAt
                )?.toLocaleString()}
              </td>
              <td className={s.duration < 120 ? "not-long-enough" : ""}>{formatTime(s.duration)}</td>
              <td>{ s.duration === bestTime ? "⏱️" : ""}</td>
              <td>{s.success ? "🏆" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SessionsTable;
