import {storeSubscription, getInfo, deleteSubscription} from '../db/firebase.js';
import styles from "../stylesheets/topSection.module.css";
import React, { useState, useEffect } from 'react';
import { ReturnStateContext } from './context';
import {Link } from 'react-router-dom';
import * as ReactDOM from 'react-dom';

const Navbar = (props) => {
    return(
        <>
            <div id={styles.navbar}>
                <img src="logo.svg"></img>
                <div id={styles.profileContainer}>
                    <Link to='/profile'>
                        <div id={styles.profile}>
                            <img id='avatar_image' src='./avatar.png' alt='Avatar'></img>
                        </div>
                    </Link>
                </div>
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
    const [notif, setNotif] = useState(sessionStorage.getItem('notificationTurnedOn'));
    const [error, setError] = useState(null);
    const [dropDownHeight, updateDropDownHeight] = useState({height: '0%'});
    const [arrowDegree, updateArrowDegree] = useState({transform: 'rotate(0deg)'});
    const [folders, updateFolders] = useState(JSON.parse(sessionStorage.getItem('folders')));
    const [notificationStatus, setNotificationStatus] = useState(sessionStorage.getItem('notificationTurnedOn'));
    const [storagetype, setStorageType] = useState('localStorage');

    useEffect(() => {
    }, [])

    const udpateSubscriptionStatus = () => {
        if (notif){
            navigator.serviceWorker.ready.then((reg) => {
                reg.pushManager.getSubscription().then((subscription) => {
                  subscription.unsubscribe().then((successful) => {
                    props.updateModal('Unsubscribed ')
                  }).catch((error) => {
                    props.updateModal('[79]Error while unsubscribing', true)
                    setError(error)
                  })
                })
            });
        }

        // update database
        // Checking if serviceWorker is supported by browser
        if (!notif){
            if ('serviceWorker' in navigator){
                subscribe()
            }
        }

        // Update the notification icon
        setNotif(!notif);
    }

    const subscribe = async () => {
        const publicVapidKey = "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
        // STEP 1 Registering service-worker.js file as service worker 
        // It returns serviceWorkerRegistration Interface of SW
        const register = await navigator.serviceWorker.register('./service-worker.js',{
            scope: "/"
        })
        props.updateModal('Service Worker is registered !')
        myConsole('Service Worker is registered successfully!');

        // STEP 2 Getting subscription of PUSH API
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        }); // Provides a subscription's URL endpoint and allows unsubscribing from a push service
        myConsole('Subscription URL generated successfully!',subscription);

        // STEP 3 Sending to database for storing
        fetch("http://localhost:4500/subscribe",{
            method: "POST",
            headers:{
                'Content-type': "application/json"
            },
            body: JSON.stringify({subscriptionURL: subscription})
        }).then(res => res.json())
        .then(resp => console.log(resp))
        .catch(err => console.error(err));

        // storeSubscription(JSON.stringify(subscription), !notif)
        // .then(resp => {
        //     console.log(resp);
        //     setTimeout(() => {
        //         props.updateModal(resp)
        // }, 1500)
        // }).catch(error => {
        //     setTimeout(() => {
        //         props.updateModal('Failed to save URL in database', true)
        //         setError(error)
        //     }, 1500)
        // })
    }

    const myConsole = (text, ext=undefined) => {
        if (true){
            console.log(text, ext);
        }
    }

    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    const updateListContainer = (e) => {
        // Updating the value in the input section's value
        props.setSearchText(e.target.value);
        if (e.target.value == ""){
            props.setSearchResult([]);
        } else {
            let payload = {
                word: e.target.value,
            }
            fetch("http://localhost:4000/find",{ 
                method: "POST",
                headers:{
                    'Content-type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(payload)
            })
            .then(resp => resp.json())
            .then(response => {
                props.setSearchResult(response.data);
            })
            .catch(err => props.updateModal(err.message));    
        }
        

    }

    const changeFolder = (name, toggle=false) => {
        if (!toggle){
            props.changeDefaultFolder(name);
        }
        if (dropDownHeight.height == '0%'){
            updateDropDownHeight({height: 'fit-content'});
            updateArrowDegree({transform: 'rotate(180deg)'});
        } else {
            updateDropDownHeight({height: '0%'});
            updateArrowDegree({transform: 'rotate(0deg)'});
        }
    }

    return(
        // Provider is in main.js file
        <ReturnStateContext.Consumer> 
            {(shouldWeReturn) => {
                return(
                    <div id={styles.sec3}>
                        <div className={styles.searchBar}>
                            <input onChange={(e) => updateListContainer(e)} type="text" placeholder="Search here..." value={props.searchText} id={styles.searchInpField} />
                        </div>
                        <div style={{display: 'flex'}} className={styles.icons}>
                            <div id={styles.currentFolder} onClick={() => changeFolder('', true)}>
                                <p id={styles.folderName}>{props.defaultFolderName}</p>
                                <i style={arrowDegree} class="fa-solid fa-angle-down"></i>
                                <div id={styles.dropDown} style={dropDownHeight}>
                                    {
                                        folders.map(name => {
                                            return(
                                                <p onClick={() => changeFolder(name)} >{name}</p>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <img src="./icons/addIcon.png" onClick={(e) => props.newStateStyles[1]({display: "flex", transform: "scale(1)"})} />
                            {
                                notif !== "false" ? 
                                <img src="./icons/notificationOn.png"/> :
                                <img src="./icons/notificationOff.png" onClick={subscribe} />
                            }
                        </div>
                    </div>
                )
            }}
        </ReturnStateContext.Consumer>
    )
}

export const Modal = (props) => {

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

export default Navbar;