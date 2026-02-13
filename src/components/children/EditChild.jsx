import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { AuthContext } from "../auth/AuthProvider";
import DeleteModal from "../modals/DeleteModal";
import Loading from "../loading/Loading";
import "./EditChild.scss";

const EditChild = () => {
  const { id } = useParams(); // ID dziecka z URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [child, setChild] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingInfo, setDeletingInfo] = useState("");

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
        const data = snap.data();
        setChild({ id: snap.id, ...data });
        setName(data.name || "");
      } else {
        setChild(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, id]);

  // ===============================
  // 🔹 INFO DO MODALA
  // ===============================
  useEffect(() => {
    if (child) {
      setDeletingInfo(`Czy na pewno chcesz usunąć ${child.name}?`);
    }
  }, [deleting, child]);

  // ===============================
  // 🔹 ZAPIS
  // ===============================
  const handleSave = async () => {
    if (!name.trim() || !user || !child) return;

    setSaving(true);

    try {
      const childRef = doc(
        db,
        "parents",
        user.uid,
        "children",
        child.id
      );

      await updateDoc(childRef, {
        name: name.trim(),
      });

      navigate(-1);
    } catch (error) {
      console.error("Błąd zapisu:", error);
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // 🔹 USUWANIE DZIECKA + SESJI
  // ===============================
  const handleDelete = async () => {
    if (!user || !child) return;

    try {
      // 1️⃣ usuń sesje
      const sessionsRef = collection(
        db,
        "parents",
        user.uid,
        "children",
        child.id,
        "sessions"
      );

      const sessionsSnapshot = await getDocs(sessionsRef);

      for (const sessionDoc of sessionsSnapshot.docs) {
        await deleteDoc(sessionDoc.ref);
      }

      // 2️⃣ usuń dziecko
      const childRef = doc(
        db,
        "parents",
        user.uid,
        "children",
        child.id
      );

      await deleteDoc(childRef);

      navigate("/");
    } catch (error) {
      console.error("Błąd usuwania dziecka:", error);
    }
  };

  // ===============================
  // 🔹 GUARDY
  // ===============================
  if (loading) return <Loading />;
  if (!child) return <p>Nie znaleziono dziecka</p>;

  // ===============================
  // 🔹 RENDER
  // ===============================
  return (
    <div className="edit-child-component">
      <h2>Edytuj bohatera</h2>

      <button
        className="edit-child-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Wróć
      </button>

      <div className="edit-child-item">
        <label>
          Imię:
          <input
            className="edit-child-input"
            type="text"
            maxLength={30}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <button onClick={handleSave} disabled={saving}>
          {saving ? "Zapisywanie..." : "Zapisz zmiany"}
        </button>
      </div>

      <button
        className="edit-child-del-btn"
        onClick={() => setDeleting(true)}
        disabled={saving}
      >
        usuń bohatera z listy
      </button>

      {deleting && (
        <DeleteModal
          setDeleting={setDeleting}
          deletingInfo={deletingInfo}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default EditChild;
