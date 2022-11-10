import React, {useState, useEffect, useRef} from "react"
import UpdateComponent from './updateComponent.js';
import styles from '../stylesheets/bottomSection.module.css';
import { deleteListFromDB, addToCompletedList, removeFromCompletedList, updatePinStatus } from '../db/firebase.js';


const List = (props) => {
    let [checked, setChecked] = useState(props.data[Object.keys(props.data)[0]]["isComplete"])
    let [key, setKey] = useState(Object.keys(props.data)[0])
    let [pinned, setPinned] = useState(props.data[Object.keys(props.data)[0]]["pinned"])
    const menu = useRef()

    const removeAndAppend = (child) => {
        const parent = document.getElementById(`${styles.listContainer}`)
        child.remove();
        parent.appendChild(child);
    }

    const removeAndPush = (child) => {
        const parent = document.getElementById(`${styles.listContainer}`)
        
        child.remove();
        parent.insertBefore(child, parent.firstChild)
    }

    const check = (e) => {
        // If the list is already checked then we have to uncheck and  update the DB
        if (checked){
            removeFromCompletedList(props.data, key)
            .then(resp => props.pullDownModal(resp))
            .catch(err => props.pullDownModal(err))
        // If it is not checked then we have to-
        } else {
            // -Add it to completed list which will also update the "isCompleted" status of
            // the corresponding meaning in its respective folder("folders" or "mix").
            addToCompletedList(props.data, key)
            .then(resp => {
                // If the DB was updated successfully then we have to check if it was pinned.
                // if it was, then we have to unpin it and update the 'pinned' value in the database
                // also we have to remove the pin image off the list by updating the pinned
                // status using setPinned function.
                if (pinned){
                    updatePinStatus(props.data, key, 'unpin')
                    .then(ret => {
                        props.pullDownModal(resp)
                        setPinned(!pinned)
                    })
                    .catch(err => props.pullDownModal(err))
                }
            })
            .catch(err => props.pullDownModal(err))

            // Remove the list from the curr position and append in the last position in the
            // same meaning list. [WHICH IS NOT ACTIVE AT THE MOMENT]
            // removeAndAppend(e.target.parentElement.parentElement);
        }
        setChecked(!checked)
    }

    const pin = (e) => {
        // Move the pinned element to top
        let child = e.target.parentElement.parentElement.parentElement.parentElement
        if (!pinned){
            updatePinStatus(props.data, key, 'pin')
            .then(resp => props.pullDownModal(resp))
            .catch(err => props.pullDownModal(err))
            removeAndPush(child);
        } else {
            updatePinStatus(props.data, key, 'unpin')
            .then(resp => props.pullDownModal(resp))
            .catch(err => props.pullDownModal(err))
            removeAndAppend(child);
        }
        
        props.checkForToggleClearance(menu)
        
        setPinned(!pinned)
    }

    const deleteList = (e) => {
        let list = e.target.parentElement.parentElement.parentElement.parentElement
        deleteListFromDB(key, props.data)
        .then(resp => {
            props.pullDownModal(resp); // Pull down modal displaying success message.
            // list.remove(); // Remove from the website's UI[CAUSED BUG, SO JUST NOW REDUCING OPACITY]
            list.style.opacity = "30%" // To show that its no available.
            list.style.pointerEvents = 'none'
            list.style.cursor = 'not-allowed'     
            props.checkForToggleClearance(menu); // toggle the menu as we have successfully deleted
        })
        .catch(err => props.pullDownModal(err))
    }

    return(
        <div className={styles.list} id={key}>
            <div className={styles.checkBox}>
                <div onClick={check} className={styles.radioBtn}>
                    {
                        checked ? 
                        <img src="./icons/checkmark.svg"/> : ""
                    }
                </div>
            </div>
            <div className={styles.meaning}>
                {
                    checked ?
                    <p> <strong>{key}</strong> - <s> {props.data[key]["meaning"]}</s>  </p> :
                    <p> <strong>{key}</strong> - {props.data[key]["meaning"]}</p>
                }
            </div>
            <div className={styles.tag}>
                {
                    props.data[key]["tag"] ?
                    <div className={styles.tagName} onClick={() => props.listTaggedAuthor(props.data[key]["docId"])}>
                        <p>{props.data[key]["tag"]}</p>
                    </div> : 
                    ""
                }
            </div>
            <div className={styles.pin}>
                {
                    pinned ?
                    <img src="./icons/pin2.svg" /> : ""
                }
            </div>
            <div className={styles.menu}>
                <div className={styles.menuList} ref={menu} data-status="close">
                    <ul>
                        <li onClick={pin}
                            style={{ borderBottom: "1px solid white" }}>
                            <img src="./icons/pin.svg"/>
                            {pinned ? "Unpin" : "Pin"}
                        </li>
                        <li onClick={deleteList} >
                            <img src="./icons/deleteIcon.svg" />
                            Delete 
                        </li>
                    </ul>
                </div>
                <img onClick={() => props.checkForToggleClearance(menu)} src="./icons/three-dots.svg" />
            </div>
        </div>
    );
}

export default UpdateComponent(List);
