import "./ShowLastSesion.scss";
// import PriceImg from "../../assets/images/price-img.png"

const ShowLastSesion = ({ onClose, lastSession }) => {
  console.log("Ostatnia sesja:", lastSession);
  return (
    <div className="show-last-sesion-component modal-backdrop">
      <div className="show-last-sesion-item modal">
        <h3>Czas Twojego mycia zębów to: {lastSession?.duration} s</h3>
        {lastSession && (
          <div style={{ marginTop: "16px" }}>
            {lastSession.success ? (
              <>
                <p style={{ color: "green" }}>
                  ✅ Świetnie! Zęby myte {lastSession.duration}s
                </p>

                {lastSession.isRecord && (
                  <p style={{ color: "gold" }}>🏆 NOWY REKORD!</p>
                )}
              </>
            ) : (
              <p style={{ color: "red" }}>
                ❌ Za krótko ({lastSession.duration}s). Następnym razem postaraj się bardziej!
              </p>
            )}
          </div>
        )}
        <div className="show-last-sesion-btns modal-btns">
          <button className="show-last-sesion-btn close-btn" onClick={onClose}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowLastSesion;
