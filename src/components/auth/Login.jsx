import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "./Login.scss";
import BgImage from "../../assets/images/dentist_wp.jpeg";


const Login = () => {

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Błąd logowania:", error);
    }
  };
  return (
    <div className="login-component">
      <div
        className="login-bg"
        style={{ backgroundImage: `url(${BgImage})` }}
      ></div>
      <div className="app-info-component">
        <p className="app-info">
          Ta strona pomaga zamienić codzienne mycie zębów w małe wyzwanie 🎯
          Odmierzaj czas, zbieraj rekordy i sprawdzaj, kto dziś był mistrzem
          szczotkowania 🏆 Bo zdrowe zęby to supermoc — a dbanie o nie może być
          fajne!
        </p>
      </div>

      <button className="login-btn" onClick={handleLogin}>
        Zaloguj się przez Google
      </button>
    </div>
  );
};

export default Login;
