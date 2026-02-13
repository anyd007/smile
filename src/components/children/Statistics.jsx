import "./Statistics.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { db } from "../firebase/firebase";
import {
  doc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Loading from "../loading/Loading";

const Statistics = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [showStats, setShowStats] = useState({
    average: 0,
    totalTime: 0,
    whenSignIn: null,
    isSuccess: 0,
    maxTime: 0,
    minTime: 0,
    allSessions: 0,
  });

  //pobieranie dziecka
  useEffect(() => {
    if (!user || !id) return;

    const childRef = doc(db, "parents", user.uid, "children", id);

    const unsubscribe = onSnapshot(childRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setChild({ id: snap.id, ...data });
      } else {
        setChild(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, id]);

  //pobieranie sesji
  useEffect(() => {
    if (!user || !child?.id) return;

    const sessionsRef = collection(
      db,
      "parents",
      user.uid,
      "children",
      child.id,
      "sessions",
    );

    const q = query(sessionsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, child]);

  useEffect(() => {
    if (!sessions.length) return;

    const formattedTime = (secends) => {
      const min = Math.floor(secends / 60);
      const sec = secends % 60;

      return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    setShowStats((prev) => {
      const totalTimeInSec = sessions.reduce((acc, curr) => {
        return acc + curr.duration;
      }, 0);

      const totalTime = formattedTime(totalTimeInSec);

      const average = formattedTime(
        Math.floor(totalTimeInSec / sessions.length),
      );

      const isSuccess = sessions.filter((item) => item.success).length;

      const maxTime = formattedTime(
        Math.max(...sessions.map((m) => m.duration)),
      );

      const minTime = formattedTime(
        Math.min(...sessions.map((m) => m.duration)),
      );

      return {
        ...prev,
        average,
        totalTime,
        isSuccess,
        maxTime,
        minTime,
        whenSignIn: null,
        allSessions: sessions.length,
      };
    });
  }, [sessions]);

  if (loading) return <Loading />;

  return (
    <div className="statistics-component">
      <button onClick={() => navigate(-1)}>wróć</button>

      <h2 className="statistics-title">{`to są twoje statystyki ${child?.name}`}</h2>
      <div className="statistics-wrapper">
        <div className="statistics-item">
          <p>tyle razy zapisałeś mycie</p>
          <p className="stats-txt">{showStats.allSessions}</p>
        </div>

        <div className="statistics-item">
          <p>łączny czas mycia zębów</p>
          <p className="stats-txt">{showStats.totalTime} min</p>
        </div>

        <div className="statistics-item">
          <p>średni czas mycia</p>
          <p className="stats-txt">{showStats.average} min</p>
        </div>

        <div className="statistics-item">
          <p>liczba zdobytych pucharów</p>
          <p className="stats-txt">{showStats.isSuccess}</p>
        </div>
        <div className="statistics-item">
          <p>najdłuższy czas mycia</p>
          <p className="stats-txt">{showStats.maxTime} min</p>
        </div>
        <div className="statistics-item">
          <p>najkródszy czas mycia</p>
          <p className="stats-txt">{showStats.minTime} min</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
