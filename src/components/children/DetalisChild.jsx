import { useState, useContext, useEffect, lazy, Suspense } from "react";
import TimerModal from "./TimerModal";

import ShowLastSesion from "../modals/ShowLastSesion";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { AuthContext } from "../auth/AuthProvider";
import Loading from "../loading/Loading";
import "./DetalisChild.scss";

const DetalisChild = ({ detalsChild, onClose, onEdit }) => {
  const SessionsTable = lazy(() => import("./SessionsTable"));

  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [lastSession, setLastSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  // const [bestTime, setBestTime] = useState(null);
  const [openLastTimeModal, setOpenLastTimeModal] = useState(false);

  const { user } = useContext(AuthContext);

  const handleFinishTimer = async (timeInSeconds) => {
    const isSussecs = timeInSeconds >= 120;

    const previousBest = sessions.length > 0 ? Math.max(...sessions.map((s) => s.duration)) : 0;

    const isRecord = timeInSeconds > previousBest;

    // if (isRecord) {
    //   setBestTime(isRecord);
    // }

    const sessionData = {
      duration: timeInSeconds,
      success: isSussecs,
      createdAt: serverTimestamp(),
    };

    // Zapis do Firestore
    try {
      const sessionsRef = collection(
        db,
        "parents",
        user.uid,
        "children",
        detalsChild.id,
        "sessions",
      );
      await addDoc(sessionsRef, sessionData);

      setLastSession({...sessionData, isRecord});

      setIsTimerOpen(false);
      setOpenLastTimeModal(true);
    } catch (error) {
      console.error("Błąd zapisywania sesji:", error);
    }
  };

  //pobranie z firebase sesji dziecka
  useEffect(() => {
    if (!user || !detalsChild?.id) return;

    const sessionsRef = collection(
      db,
      "parents",
      user.uid,
      "children",
      detalsChild.id,
      "sessions",
    );

    const q = query(sessionsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(data);

    });

    return () => unsubscribe(); // cleanup
  }, [user, detalsChild]);

  // const successCount = sessions.filter(s => s.success).length;
  // console.log(successCount)

  
  return (
    <div className="detals-child-component">
      <button className="detals-child-back-btn" onClick={onClose}>
        ← Wróć
      </button>
      <button onClick={onEdit}>✏️ Edytuj dane</button>

      <h2>Cześć {detalsChild.name}!</h2>

      <button onClick={() => setIsTimerOpen(true)}>Zaczynamy mycie 🪥</button>

      {isTimerOpen && (
        <TimerModal
          onClose={() => setIsTimerOpen(false)}
          onFinish={handleFinishTimer}
        />
      )}
      {openLastTimeModal && (
        <ShowLastSesion
          onClose={() => setOpenLastTimeModal(false)}
          lastSession={lastSession}
        />
      )}
      <Suspense fallback={<Loading />}>
        <SessionsTable sessions={sessions} lastSession={lastSession} />
      </Suspense>
    </div>
  );
};

export default DetalisChild;
