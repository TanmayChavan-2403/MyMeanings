import {storeSubscription, getInfo, deleteSubscription} from '../db/firebase.js';
import styles from "../stylesheets/topSection.module.css";
import React, { useState, useEffect } from 'react';
import { storeDataInDb } from "../db/firebase";
import { ReturnStateContext } from './context';
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
    const [notif, setNotif] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [notificationStatus, setNotificationStatus] = useState(false)
    const [storagetype, setStorageType] = useState('localStorage')

    useEffect(() => {
        if (!notificationStatus){
            getInfo()
            .then(res => {
                setNotif(res['notificationStatus'])
                setStorageType(res['storageType'])
                setNotificationStatus(true)
            })
            .catch(err => pullDown(err))
        }
        
    }, [])

    const udpateSubscriptionStatus = () => {
        if (notif){
            navigator.serviceWorker.ready.then((reg) => {
                reg.pushManager.getSubscription().then((subscription) => {
                  subscription.unsubscribe().then((successful) => {
                    deleteSubscription()
                    pullDown('Unsubscribed Successfully')
                  }).catch((e) => {
                    pullDown('ERROR! while unsubscribing', e)
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
        pullDown('Service Worker is registered successfully!')
        myConsole('Service Worker is registered successfully!');

        // STEP 2 Getting subscription of PUSH API
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        }); // Provides a subscription's URL endpoint and allows unsubscribing from a push service
        myConsole('Subscription URL generated successfully!',subscription);

        // STEP 3 Sending to database for storing
        storeSubscription(JSON.stringify(subscription), !notif)
        .then(resp => {
            console.log(resp);
            setTimeout(() => {
                pullDown(resp)
            }, 1500)
        }).catch(err => {
            console.log(err);
            setTimeout(() => {
                pullDown(err)
            }, 1500)
        })
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

    const pullDown = (text) => {
        let portal = document.getElementById(`portals`).children;
        let modal;
        if (portal[1].id.includes("modal")){
            modal = portal[1];
        }
        else{
            modal = portal[0];
        }
        modal.children[2].children[0].innerText = text;
        modal.style.top = "10px";
        setTimeout(()=>{
            modal.style.top = "-100px";
        }, 3000)
    }

    const goBack = () => {
        if (window.localStorage.length === 0){
            props.updatePinnedList(JSON.parse(window.sessionStorage.getItem('pinned')))
            props.updateUnpinnedList(JSON.parse(window.sessionStorage.getItem('unpinned')))
        } else {
            props.updatePinnedList(JSON.parse(window.localStorage.getItem('pinned')))
            props.updateUnpinnedList(JSON.parse(window.localStorage.getItem('unpinned')))
        }
        props.updateReturnBtnStatue()
    }

    const updateListContainer = (e) => {
        if (e.target.value === ""){
            console.log('we got notthing, turning back :(')
            setSearchText(e.target.value)
            if (storagetype == 'sessionStorage'){
                props.updatePinnedList(JSON.parse(window.sessionStorage.getItem('pinned')))
                props.updateUnpinnedList(JSON.parse(window.sessionStorage.getItem('unpinned')))
            } else {
                props.updatePinnedList(JSON.parse(window.localStorage.getItem('pinned')))
                props.updateUnpinnedList(JSON.parse(window.localStorage.getItem('unpinned')))
            }
            return
        }
        // Updating the searchText which will reflect in search bar.
        setSearchText(e.target.value)

        let tempPinnedList = []
        let tempUnpinnedList = []
        if (storagetype == 'sessionStorage'){
            JSON.parse(window.sessionStorage.getItem('pinned')).map(obj => {
                let word = Object.keys(obj)[0].toLowerCase()
                if (word.startsWith(e.target.value.toLowerCase())){
                    console.log(word);
                    tempPinnedList.push(obj)
                }
            })

            JSON.parse(window.sessionStorage.getItem('unpinned')).map(obj => {
                let word = Object.keys(obj)[0].toLowerCase()
                if (word.startsWith(e.target.value.toLowerCase())){
                    console.log(word);
                    tempUnpinnedList.push(obj)
                }
            })
        } else {
            JSON.parse(window.localStorage.getItem('pinned')).map(obj => {
                let word = Object.keys(obj)[0].toLowerCase()
                if (word.startsWith(e.target.value.toLowerCase())){
                    console.log(word);
                    tempPinnedList.push(obj)
                }
            })

            JSON.parse(window.localStorage.getItem('unpinned')).map(obj => {
                let word = Object.keys(obj)[0].toLowerCase()
                if (word.startsWith(e.target.value.toLowerCase())){
                    console.log(word);
                    tempUnpinnedList.push(obj)
                }
            })
        }
        
        props.updatePinnedList(tempPinnedList)
        props.updateUnpinnedList(tempUnpinnedList)
    }

    return(
        // Provider is in main.js file
        <ReturnStateContext.Consumer> 
            {(shouldWeReturn) => {
                return(
                    <div id={styles.sec3}>
                        <div className={styles.searchBar}>
                            <input onChange={(e) => updateListContainer(e)} type="text" placeholder="Search here..." value={searchText} id={styles.searchInpField} />
                        </div>
                        <div style={{display: 'flex'}} className={styles.icons}>
                            {/* <div className={styles.icon}> */}
                                {
                                    shouldWeReturn ? 
                                    <img src="./icons/backArrowWhite.png" onClick={goBack}/> : 
                                    <img src="./icons/backArrowGrey.png" style={{cursor: 'not-allowed'}}/>
                                    
                                }
                            {/* </div> */}
                            {/* <div className={styles.icon}> */}
                                <img src="./icons/addIcon.png" onClick={(e) => props.newStateStyles[1]({display: "flex", transform: "scale(1)"})} />
                            {/* </div> */}
                            {/* <div className={styles.icon} onClick={udpateSubscriptionStatus}> */}
                                {
                                    notif ? 
                                    <img src="./icons/notificationOn.png"/> : 
                                    <img src="./icons/notificationOff.png" />
                                }
                            {/* </div> */}
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