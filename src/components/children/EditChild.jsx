import { useState, useContext } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { AuthContext } from "../auth/AuthProvider";
import "./EditChild.scss";

const EditChild = ({ child, onClose }) => {
  const [name, setName] = useState(child.name);
  const [saving, setSaving] = useState(false);
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Czy napewno chcesz usunąć ${child.name}?`,
    );
    if (!confirmDelete) return;

    try {
      const childRef = doc(db, "parents", user.uid, "children", child.id);

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
      
      <button className="edit-child-del-btn" onClick={handleDelete} disabled={saving}>
        {saving ? "Usówanie..." : "usuń bohatera z listy"}
      </button>
    </div>
  );
};

export default EditChild;
