//pobieranie statystk dla wszystkich urzytkowników, obecnie nie jest uzywane. Model na przyszłość 


// import { useEffect, useState, useCallback } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
// } from "firebase/firestore";
// import { db } from "../components/firebase/firebase";

// export const useParentStats = (userId, options = {}) => {
//   const { includeChildren = false } = options;

//   const [stats, setStats] = useState(null);
//   const [meta, setMeta] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const calculateStats = useCallback(async () => {
//     if (!userId) return;

//     setLoading(true);
//     setError(null);

//     try {
//       // 🔹 1. Pobierz dzieci rodzica
//       const childrenRef = collection(db, "parents", userId, "children");
//       const childrenSnap = await getDocs(childrenRef);

//       const children = childrenSnap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       let totalSessions = 0;
//       let totalSuccess = 0;
//       let totalDuration = 0;

//       let bestRecord = null;
//       let lastSessionAt = null;

//       const sessionsCountByChild = {};

//       // 🔹 2. Iteruj po dzieciach i ich sesjach
//       for (const child of children) {
//         const sessionsRef = collection(
//           db,
//           "parents",
//           userId,
//           "children",
//           child.id,
//           "sessions"
//         );

//         const q = query(sessionsRef, orderBy("createdAt", "desc"));
//         const sessionsSnap = await getDocs(q);

//         sessionsCountByChild[child.id] = sessionsSnap.size;

//         sessionsSnap.forEach((doc) => {
//           const session = doc.data();

//           totalSessions++;
//           totalDuration += session.duration;

//           if (session.success) {
//             totalSuccess++;
//           }

//           // 🔥 rekord
//           if (
//             !bestRecord ||
//             session.duration > bestRecord.duration
//           ) {
//             bestRecord = {
//               duration: session.duration,
//               childId: child.id,
//               childName: child.name ?? "Nieznane",
//             };
//           }

//           // 🕒 ostatnia sesja
//           if (
//             session.createdAt &&
//             (!lastSessionAt ||
//               session.createdAt.toMillis() > lastSessionAt.toMillis())
//           ) {
//             lastSessionAt = session.createdAt;
//           }
//         });
//       }

//       // 🔹 3. Finalne statystyki
//       const calculatedStats = {
//         totalChildren: children.length,
//         totalSessions,
//         totalSuccess,
//         successRate:
//           totalSessions > 0
//             ? Math.round((totalSuccess / totalSessions) * 100)
//             : 0,
//         averageTime:
//           totalSessions > 0
//             ? Math.round(totalDuration / totalSessions)
//             : 0,
//         bestRecord,
//         lastSessionAt,
//       };

//       setStats(calculatedStats);

//       setMeta({
//         childrenIds: children.map((c) => c.id),
//         sessionsCountByChild,
//         ...(includeChildren && { children }),
//       });
//     } catch (err) {
//       console.error("Błąd statystyk rodzica:", err);
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, includeChildren]);

//   useEffect(() => {
//     calculateStats();
//   }, [calculateStats]);

//   return {
//     stats,
//     meta,
//     loading,
//     error,
//     refresh: calculateStats,
//   };
// };
