import React from "react";
import styles from "./modal.module.css"
import * as ReactDOM from 'react-dom';


function Modal(props){
    const closeModal = (props) => {
        let modal = document.getElementById(`${styles.modal}`);
        modal.style.top = "-100px";
    }

    return ReactDOM.createPortal(
        <>
            <div id={styles.modal} style={{top: props.modalTopPosition}}>
                <div style={{backgroundColor: props.modalMsgType}} className={styles.colorBar}></div>
                <div className={styles.logoSec}>
                    <img src="icon.png" />
                </div>
                <div className={styles.message}>
                    <p>{props.modalDisplayText}</p>
                </div>
                <div onClick={closeModal} className={styles.closeButton}>
                    <img src="icons/close.svg"/>
                </div>
            </div>
        </>
        ,
        document.getElementById("portals")
    );
}

export default Modal