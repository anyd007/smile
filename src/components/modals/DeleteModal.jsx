import "./DeleteModal.scss";

const DeleteModal = ({ setDeleting, deletingInfo, handleDelete}) => {
    return ( <div className="delete-modal-container modal-backdrop">
        <div className="delete-modal modal">
            <h2 className="delete-modal-title">uwaga!!!</h2>
            <p className="delete-modal-info">{deletingInfo}</p>
            <div className="delete-modal-btns">
                <button className="delete-modal-confirm" onClick={handleDelete}>potwierdzam</button>
                <button className="delete-modal-return" onClick={()=> setDeleting(false)}>wróć</button>
            </div>
        </div>
    </div> );
}
 
export default DeleteModal;