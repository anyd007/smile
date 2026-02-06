import { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../auth/AuthProvider";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Loading from "../loading/Loading";
import Drow from "../Draw";
import BackgroundBlobs from "../backgrounds/BackgroundBlobs";
import "./ChildrenList.scss";

const ChildrenList = ({ onSelectedChild, selectedChild }) => {
  const { user } = useContext(AuthContext);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const childrenRef = collection(db, "parents", user.uid, "children");
    const q = query(childrenRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChildren(list);
        setLoading(false);
      },

      (error) => {
        console.error("Błąd pobierania dzieci:", error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [user]);


  return (
    <div className="child-list-component">
      {!loading && children.length > 0 && <h2>wybierz bohatera:</h2>}
      {!loading && <BackgroundBlobs/>}

      {loading ? (
        <Loading />
      ) : (
        <div className="child-list-items">
          {children.length === 0 ? (
            <h2>Brak dodanych bohaterów...</h2>
          ) : (
            children.map((child) => (
              <div
                className="child-list-item"
                key={child.id}
                onClick={() => onSelectedChild && onSelectedChild(child)}
              >
                
                <h3 className="child-list-name">{child.name}</h3>
                {child.avatar && (
                  <img src={child.avatar} alt="avatar" width="30" />
                )}
              </div>
            ))
          )}
        </div>
      )}
      {children.length > 1 && <Drow drawList={children} />}
    </div>
  );
};

export default ChildrenList;
