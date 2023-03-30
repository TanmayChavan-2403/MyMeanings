import React, {useState, useEffect, useRef} from "react"
import styles from '../stylesheets/bottomSection.module.css';
import { deleteListFromDB, addToCompletedList, removeFromCompletedList, updatePinStatus } from '../db/firebase.js';


const List = (props) => {
    let [checked, setChecked] = useState(props.data["isComplete"])
    let [key, setKey] = useState(props.data["_id"]);
    let [pinned, setPinned] = useState(props.data["isPinned"])
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
        /*
            if (it is pinned) then
                remove from pinned and also mark as completed 
                i.e. update database and set isPinned to false and isCompleted to true
            else 
                just mark it as completed.

            // IN THE END update the "checked" state of this component so that it can be reflected in the UI.
        */
        let child = e.target.parentElement.parentElement.parentElement.parentElement
        let payload;
        if (pinned){
            payload = { // Creating payload and sending it to "updateDatabase" function.
                key,
                changes:{
                    isPinned: !pinned,
                    isCompleted: !checked
                }
            }
            setPinned(!pinned);
        } else {
            payload = { // Creating payload and sending it to "updateDatabase" function.
                key,
                changes:{
                    isCompleted: !checked
                }
            }
        }
        updateDatbase(payload);

        setChecked(!checked);
    }

    const pin = (e) => {
        let child = e.target.parentElement.parentElement.parentElement.parentElement
        if (!pinned){
            // Move the pinned element to top
            removeAndPush(child);
        } else {
            // Move the unpinned element to bottom 
            removeAndAppend(child);
        }
        // Create a payload which is according to the route parameters accepted by the backend;
        let payload = {
            key,
            changes:{
                isPinned: !pinned
            }
        }
        // fetch returns an object containing {status: "FAIL | PASS", message: 'message'}
        updateDatbase(payload);

        // This function is inherited from 'listContainer' component which is responsile for closing the menu toggled by
        // clicking on the three dots.
        props.checkForToggleClearance(menu)
        // To update the pinned useState so that it reflects in UI(add pin image/ remove pin image).
        setPinned(!pinned)
    }

    const updateDatbase = (payload) => {
        fetch("http://localhost:4000/updateField",{ 
            method: "POST",
            headers:{
                'Content-type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })
        .then(resp => resp.json())
        .then(response => props.updateModal(response.message))
        .catch(err => props.updateModal(err.message));
    }

    const deleteList = (e) => {
        let list = e.target.parentElement.parentElement.parentElement.parentElement
        let payload = {
            key,
            word: props.data["word"]
        }
        fetch("http://localhost:4000/deleteData",{ 
            method: "DELETE",
            headers:{
                'Content-type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })
        .then(resp => resp.json())
        .then(response => {
            props.updateModal(response.message); // Pull down modal displaying success message.
            // list.remove(); // Remove from the website's UI[CAUSED BUG, SO JUST NOW REDUCING OPACITY]
            list.style.opacity = "30%" // Reducing opacity, To show that its no available.
            list.style.pointerEvents = 'none'
            list.style.cursor = 'not-allowed'
        })
        .catch(err => props.updateModal(err.message, true));
    }

    return(
        <div className={styles.list} id={key} >
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
                    <p> <strong>{props.data["word"]}</strong> - <s> {props.data["meaning"]}</s>  </p> :
                    <p> <strong>{props.data["word"]}</strong> - {props.data["meaning"]}</p>
                }
            </div>

            <div className={styles.pin}>
                {
                    pinned ?
                    <img src="./icons/pin2.svg" /> : ""
                }
            </div>
            <div className={styles.tag}>
                {
                    props.data["tag"] ?
                    <div className={styles.tagName} onClick={() => props.listTaggedAuthor(props.data[key]["docId"])}>
                        <p>{props.data["tag"]}</p>
                    </div> : 
                    ""
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

export default List;
