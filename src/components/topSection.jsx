import styles from "../stylesheets/topSection.module.css";
import React, { useState, useEffect } from 'react';
import {Link } from 'react-router-dom';

const Navbar = (props) => {
    return(
        <>
            <div id={styles.navbar}>
                <img src="logo.svg" alt="logo"></img>
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
    const [dropDownHeight, updateDropDownHeight] = useState({height: '0%'});
    const [arrowDegree, updateArrowDegree] = useState({transform: 'rotate(0deg)'});
    // eslint-disable-next-line
    const [folders, updateFolders] = useState(JSON.parse(sessionStorage.getItem('folders')) || []);

    useEffect(() => {
    }, [])

    const unSubscribe = () => {
        if (notif){
            // unregistering from the browser
            navigator.serviceWorker.ready.then((reg) => {
                reg.pushManager.getSubscription().then((subscription) => {
                  subscription.unsubscribe().then((successful) => {
                    console.log("removed from browser")
                    props.updateModal('Unsubscribed Successfully!')
                  }).catch((error) => {
                    props.updateModal('[59]Error while unsubscribing', true)
                  })
                })
            });


            fetch(`${process.env.REACT_APP_SERVERURL}/subscribe`,{
                method: "POST",
                credentials: "include",
                headers:{
                    'Content-type': "application/json"
                },
                body: JSON.stringify({subscriptionURL: "", notif: false})
            }).then(res => res.json())
            .then(resp => {
                props.updateModal(resp.message)
                window.sessionStorage.setItem('notificationTurnedOn', "false")
                
                // Update the notification icon
                setNotif("false");

                navigator.serviceWorker.ready.then((reg) => {
                    reg.pushManager.getSubscription().then((subscription) => {
                      subscription.unsubscribe().then((successful) => {
                        props.updateModal('Unsubscribed Successfully')
                      }).catch((error) => {
                        props.updateModal('[86]Error while unsubscribing', true)
                      })
                    })
                });
            })
            .catch(err => {
                console.log(err)
                props.updateModal(err.message, true)
            });
        }

        
    }

    const subscribe = async () => {
        // A random generated key
        const publicVapidKey = "BIW3IW2Mm2RWAT2wzlV_VQ6kweq-Wxu7UYmWaXjjXVCMuV9tvEYZIKyOLuMHimZ6eBUkE4ThHsqwW2WxWkTyctg";

        // STEP 1 Registering service-worker.js file as service worker 
        // It returns serviceWorkerRegistration Interface of SW
        const register = await navigator.serviceWorker.register('./service-worker.js',{
            scope: "/"
        })
        // props.updateModal('Service Worker is registered !')
        myConsole('Service Worker is registered successfully!');

        // STEP 2 Getting subscription of PUSH API
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        }); // Provides a subscription's URL endpoint and allows unsubscribing from a push service
        myConsole('Subscription URL generated successfully!',subscription);

        // STEP 3 Sending to database for storing
        fetch(`${process.env.REACT_APP_SERVERURL}/subscribe`,{
            method: "POST",
            credentials: "include",
            headers:{
                'Content-type': "application/json"
            },
            body: JSON.stringify({subscriptionURL: subscription, notif: true})
        }).then(res => res.json())
        .then(resp => {
            props.updateModal(resp.message)
            window.sessionStorage.setItem('notificationTurnedOn', "true")
            
            // Update the notification icon
            setNotif("true");
        })
        .catch(err => console.error(err));
    }

    const myConsole = (text, ext=undefined) => {
        if (true){
            console.log(text, ext);
        }
    }

    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - base64String.length % 4) % 4);
      // eslint-disable-next-line
      const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

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
        if (e.target.value === ""){
            props.setSearchResult([]);
        } else {
            let payload = {
                word: e.target.value,
            }
            fetch(`${process.env.REACT_APP_SERVERURL}/find`,{ 
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
        if (dropDownHeight.height === '0%'){
            updateDropDownHeight({height: 'fit-content'});
            updateArrowDegree({transform: 'rotate(180deg)'});
        } else {
            updateDropDownHeight({height: '0%'});
            updateArrowDegree({transform: 'rotate(0deg)'});
        }
    }

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
                <img src="./icons/addIcon.png" alt="Add" onClick={(e) => props.newStateStyles[1]({display: "flex", transform: "scale(1)"})} />
                {
                    notif !== "false" ? 
                    <img src="./icons/notificationOn.png" alt='On' onClick={unSubscribe}/> :
                    <img src="./icons/notificationOff.png" alt="Off" onClick={subscribe} />
                }
            </div>
        </div>
    )
}

export default Navbar;