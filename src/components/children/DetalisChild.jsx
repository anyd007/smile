import { useState, useContext, useEffect, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
} from "firebase/firestore";

import TimerModal from "./TimerModal";
import ShowLastSesion from "../modals/ShowLastSesion";
import { db } from "../firebase/firebase";
import { AuthContext } from "../auth/AuthProvider";
import Loading from "../loading/Loading";
import "./DetalisChild.scss";

const SessionsTable = lazy(() => import("./SessionsTable"));

const DetalisChild = () => {
  const { id } = useParams(); // ID dziecka z URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [child, setChild] = useState(null);
  const [loadingChild, setLoadingChild] = useState(true);

  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [lastSession, setLastSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [openLastTimeModal, setOpenLastTimeModal] = useState(false);

  // ===============================
  // 🔹 POBRANIE DZIECKA
  // ===============================
  useEffect(() => {
    if (!user || !id) return;

    const childRef = doc(
      db,
      "parents",
      user.uid,
      "children",
      id
    );

    const unsubscribe = onSnapshot(childRef, (snap) => {
      if (snap.exists()) {
        setChild({ id: snap.id, ...snap.data() });
      } else {
        setChild(null);
      }
      setLoadingChild(false);
    });

    return () => unsubscribe();
  }, [user, id]);

  // ===============================
  // 🔹 POBRANIE SESJI
  // ===============================
  useEffect(() => {
    if (!user || !child?.id) return;

    const sessionsRef = collection(
      db,
      "parents",
      user.uid,
      "children",
      child.id,
      "sessions"
    );

    const q = query(sessionsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(data);
    });

    return () => unsubscribe();
  }, [user, child]);
 
  // ===============================
  // 🔹 ZAKOŃCZENIE TIMERA
  // ===============================
  const handleFinishTimer = async (timeInSeconds) => {
    if (!user || !child) return;

    const isSuccess = timeInSeconds >= 120;
    const previousBest =
      sessions.length > 0
        ? Math.max(...sessions.map((s) => s.duration))
        : 0;

    const isRecord = timeInSeconds > previousBest;

    const sessionData = {
      duration: timeInSeconds,
      success: isSuccess,
      createdAt: serverTimestamp(),
    };

    try {
      const sessionsRef = collection(
        db,
        "parents",
        user.uid,
        "children",
        child.id,
        "sessions"
      );

      await addDoc(sessionsRef, sessionData);

      setLastSession({ ...sessionData, isRecord });
      setIsTimerOpen(false);
      setOpenLastTimeModal(true);
    } catch (error) {
      console.error("Błąd zapisu sesji:", error);
    }
  };

  // ===============================
  // 🔹 GUARDY
  // ===============================
  if (loadingChild) return <Loading />;
  if (!child) return <p>Nie znaleziono dziecka</p>;

  // ===============================
  // 🔹 RENDER
  // ===============================
  return (
    <div className="detals-child-component">
      <button
        className="detals-child-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Wróć
      </button>

      <button onClick={() => navigate(`/children/${id}/edit`)}>
        ✏️ Edytuj dane
      </button>

      <h2>Cześć {child.name}!</h2>

      <button onClick={() => setIsTimerOpen(true)}>
        Zaczynamy mycie 🪥
      </button>

      {isTimerOpen && (
        <TimerModal
          onClose={() => setIsTimerOpen(false)}
          onFinish={handleFinishTimer}
        />
      )}

      {openLastTimeModal && lastSession && (
        <ShowLastSesion
          onClose={() => setOpenLastTimeModal(false)}
          lastSession={lastSession}
        />
      )}

      <Suspense fallback={<Loading />}>
        <SessionsTable
          sessions={sessions}
          lastSession={lastSession}
        />
        {sessions.length !== 0 && <button onClick={() => navigate(`/children/${id}/stats`)}>pokaż moje statystyki...</button>}
      </Suspense>
    </div>
  );
};

export default DetalisChild;
