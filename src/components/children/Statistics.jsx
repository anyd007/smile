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

  return (
    <div className="statistics-component">
      <button onClick={() => navigate(-1)}>wróć</button>
      <h2>{`to są twoje statystyki ${child?.name}`}</h2>
      <p>
        tyle razy zapisałeś mycie: <span>{showStats.allSessions}</span>
      </p>
      <p>
        łączny czas mycia zębów <span>{showStats.totalTime}</span>
      </p>
      <p>
        śdrednia czasu mycia zebów <span>{showStats.average}</span>
      </p>
      <p>
        liczna zdobytych pucharów <span>{showStats.isSuccess}</span>
      </p>
      <p>
        najdłuższy czas mycia <span>{showStats.maxTime}</span>
      </p>
      <p>
        najkrudszy czas mycia <span>{showStats.minTime}</span>
      </p>
    </div>
  );
};

export default Statistics;
