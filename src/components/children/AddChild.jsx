import { useState, useContext } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../auth/AuthProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Loading from "../loading/Loading";
import InfoSideModal from "../modals/InfoSideModal";
import "./AddChild.scss";

const AddChild = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sideInfoText, setSideInfoText] = useState("");
  const [isInfo, setIsInfo] = useState(false);

  // Jeśli Auth się ładuje lub user jest null → nie pokazujemy formularza
  if (authLoading || !user) return null;

  const handleAddChild = async (e) => {
    e.preventDefault();
    
    if(!name){
      //przekazywanie info do komponentu InfoSideModal
      setSideInfoText("Podaj imie bohatera...");
      setIsInfo(true);
      return
    } 

    setLoading(true);
    try {
      // Kolekcja dzieci dla zalogowanego rodzica
      const childrenRef = collection(db, "parents", user.uid, "children");

      await addDoc(childrenRef, {
        name,
        createdAt: serverTimestamp(),
        avatar: "", // później można dodać wybór avataru
      });

      setName(""); // reset pola

      //przekazywanie info do komponentu InfoSideModal
      setSideInfoText("Bohater dodany!");
      setIsInfo(true);
    } catch (error) {
      console.error("Błąd dodawania dziecka:", error);
      
      //przekazywanie info do komponentu InfoSideModal
      setSideInfoText("Błąd dodawania dziecka. Sprawdź konsolę.");
      setIsInfo(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-child-component">
    {loading && <Loading />}
    {isInfo && <InfoSideModal setIsInfo={setIsInfo} sideInfoText={sideInfoText}/>}
    <h2>Podaj imię nowego bohatera:</h2>
    <form style={{width:"100%"}} onSubmit={handleAddChild}>
      <input
      maxLength={30}
        className="add-input"
        type="text"
        placeholder="Imię bohatera"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="add-child-btn" type="submit" disabled={loading}>
        {loading ? "Dodawanie..." : "Dodaj"}
      </button>
    </form>
    </div>
  );
};

export default AddChild;
