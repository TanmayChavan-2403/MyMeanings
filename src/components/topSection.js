import styles from "../stylesheets/topSection.module.css";
import { storeDataInDb } from "../db/firebase";
import * as ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import {storeSubscription, getStatus} from '../db/firebase.js';


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

    useEffect(() => {
        getStatus()
        .then(res => setNotif(res))
        .catch(err => pullDown(err))
    }, [])

    const udpateSubscriptionStatus = () => {
        // Update the notification icon
        setNotif(!notif);

        // update database
        // Checking if serviceWorker is supported by browser
        if ('serviceWorker' in navigator){
            subscribe()
        }
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

        // Sending to database for storing
        storeSubscription(JSON.stringify(subscription), !notif)
        .then(resp => {
            setTimeout(() => {
                pullDown(resp)
            }, 1500)
        }).catch(err => {
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

    return(
        <>
            <div id={styles.sec3}>
                <div className={styles.searchBar}>
                    <input type="text" placeholder="Search here..." id={styles.searchInpField} />
                </div>
                <div className={styles.notification} onClick={udpateSubscriptionStatus}>
                    {
                        notif ? 
                        <img src="./icons/notification-active.png"/> : 
                        <img src="./icons/notirication-notActive.png" />
                    }
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