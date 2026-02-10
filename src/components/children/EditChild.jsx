import { useState, useContext, useEffect } from "react";
import { doc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { AuthContext } from "../auth/AuthProvider";
import DeleteModal from "../modals/DeleteModal";
import "./EditChild.scss";

const EditChild = ({ child, onClose }) => {
  const [name, setName] = useState(child.name);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false)
  const [deletingInfo, setDeletingInfo] = useState("")
  const { user } = useContext(AuthContext);

  const handleSave = async () => {
    if (!name.trim()) return;

    setSaving(true);

    try {
      const childRef = doc(db, "parents", user.uid, "children", child.id);

      await updateDoc(childRef, {
        name: name.trim(),
      });

      onClose();
      
    } catch (error) {
      console.error("Błąd zapisu:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() =>{
    setDeletingInfo(`Czy napewno chcesz usunąć ${child.name}?`)
  }, [deleting, child])

  const handleDelete = async () => {
    
    if (!deleting) return;

    try {
      const childRef = doc(db, "parents", user.uid, "children", child.id);

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
    await deleteDoc(childRef);

      onClose();
    } catch (error) {
      console.error("Błąd usuwania dziecka:", error);
    }
  };

  return (
    <div className="edit-child-component">
      <h2>Edytuj bohatera</h2>
      <button className="edit-child-back-btn" onClick={onClose}>← Wróć</button>
      <div className="edit-child-item">
         <label>
        imię:
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
      
      <button className="edit-child-del-btn" onClick={() => setDeleting(true)} disabled={saving}>
        {saving ? "Usówanie..." : "usuń bohatera z listy"}
      </button>
      {deleting && <DeleteModal setDeleting={setDeleting} deletingInfo={deletingInfo} handleDelete={handleDelete}/>}
    </div>
  );
};

export default EditChild;
