import "./InfoSideModal.scss";

const InfoSideModal = ({setIsInfo, sideInfoText}) => {
    return ( 
        <div className="info-side-modal modal-backdrop">
            <div className="info-side-modal-item modal">
                <div className="info-side-modal-text">
                    <p>{sideInfoText}</p>
                </div>
                <div className="info-side-modal-btns modal-btns">
                    <button onClick={() => setIsInfo(false)}>ok</button>
                </div>

            </div>

        </div>
     );
}
 
export default InfoSideModal;