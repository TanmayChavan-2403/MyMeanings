import styles from "../stylesheets/topSection.module.css";
import { storeDataInDb } from "../db/firebase";
import * as ReactDOM from 'react-dom';

const Navbar = (props) => {
    return(
        <>
            <div id={styles.navbar}>
                <img src="logo.svg"></img>
            </div>
        </>
    )
}

export const StatusLine = (props) => {
    return(
        <>
            <div id={styles.status}>
                <div className={styles.completed}>
                    <span className={styles.toolTip}>60%</span>
                </div>
                <div className={styles.remaining}>
                    <span className={styles.toolTip}>40%</span>
                </div>
            </div>
        </>
    )
}

export const SearchBar = (props) => {


    return(
        <>
            <div id={styles.sec3}>
                <div className={styles.searchBar}>
                    <input type="text" placeholder="Search here..." id={styles.searchInpField} />
                </div>
            </div>
        </>
    )
}

export const Modal = (props) => {

    const closeModal = (props) => {
        let modal = document.getElementById(`${styles.modal}`);
        modal.style.top = "-100px";
    }

    return ReactDOM.createPortal(
        <>
            <div id={styles.modal}>
                <div className={styles.colorBar}></div>
                <div className={styles.logoSec}>
                    <img src="icon.png" />
                </div>
                <div className={styles.message}>
                    <p>Uploaded successfully</p>
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

export default Navbar;