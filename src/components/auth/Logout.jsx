import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from '../firebase/firebase';
import LogoutModal from "./LogoutModal";
import  "./Logout.scss";


const Logout = ({ userData }) => {
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);

    const handleLogoutClick = () => {
        setOpenLogoutModal(true);
    }

    useEffect(() =>{
        if (confirmLogout) {
            signOut(auth);
        }
    }, [confirmLogout]);

    return (
        <div className="logout-component">
            <div className="user-data">
                <p> Witaj, {userData.displayName}</p>
            </div>
            <button className="logout-btn" onClick={handleLogoutClick}>Wyloguj się</button>
            {openLogoutModal && <LogoutModal  setConfirmLogout={setConfirmLogout} setOpenLogoutModal={setOpenLogoutModal}/>}
        </div>
        
    )
}
export default Logout;