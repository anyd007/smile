import "./LogOutModal.scss";
const LogOutModal = ({ setConfirmLogout, setOpenLogoutModal }) => {
    const handleConfirm = () => {
        setConfirmLogout(true);
        setOpenLogoutModal(false);
    }
    const handleCancel = () => {
        setOpenLogoutModal(false);
    }
  return (
    <div className="logout-modal-component">
      <div className="logout-modal">
        <h2 className="logout-modal-title">Czy na pewno chcesz się wylogować?</h2>
        <div className="buttons">
          <button className="confirm-logout" onClick={handleConfirm}>Tak, wyloguj mnie</button>
          <button className="cancel-logout" onClick={handleCancel}>Anuluj</button>
        </div>
      </div>
    </div>
  );
};

export default LogOutModal;
