// import List from './list';
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { getCollection, getInfo, updateInfo } from "../db/firebase";
import styles from '../stylesheets/bottomSection.module.css';
import Fallback from './fallbackComp.js'
import { ReturnFunctionHandlerContext } from './context';
const List = React.lazy(() => import('./list'))

const ListContainer = (props) => {
	let [flag, updateFlag] = useState(false);
	let [element, updateElement] = useState(null);
	let [listFetched, updateListStatus] = useState(false);
	let [questionAsked, setQuestionAsked] = useState(null)
	let [storageType, setStorageType] = useState("sessionStorage");
	let [isPinnedArraySorted, setPinnedSortedStatus] = useState(false);
	let [storageQuestionAsked, setStorageQuestionAsked] = useState(true)
	let [isUnpinnedArraySorted, setUnpinnedSortedStatus] = useState(false);
	
	// It is used to store the incoming data until its sorted
	let [tempPinnedList, setTempPinnedList] = useState([]);
	let [tempUnpinnedList, setTempUnpinnedList] = useState([]);

	const updateLists = (param, tagged=false) => {
		
		console.log('Updating list.');

		// Iterating through the response and seperating the pinned and unpinned data
		param.forEach( (data) => {
			for (const prop in data.data()){
				if (data.data()[prop]["pinned"]) {
					// props.updatePinnedList(oldElements => [...oldElements, {[prop]: data.data()[prop]}])
					setTempPinnedList(oldElements => [...oldElements, {[prop]: data.data()[prop]}])
					// tempPinnedList.push({[prop]: data.data()[prop]})
				} else {
					// props.updateUnpinnedList(oldElements => [...oldElements, {[prop]: data.data()[prop]}])
					setTempUnpinnedList(oldElements => [...oldElements, {[prop]: data.data()[prop]}])
					// tempUnpinnedList.push({[prop]: data.data()[prop]})
				}
			}
		})
		// props.updatePinnedList(prevItems => [...prevItems, ...tempPinnedList])
		// props.updateUnpinnedList(prevItems => [...prevItems, ...tempUnpinnedList])
	}

	const listTaggedAuthor = (tag) => {
		let pinnedList;
		let unpinnedList;

		// Checking where our data is stored, In sessionStorage or localStorage?
		if (storageType == 'sessionStorage'){
			pinnedList = JSON.parse(window.sessionStorage.getItem('pinned'));
			unpinnedList = JSON.parse(window.sessionStorage.getItem('unpinned'));
		} else {
			pinnedList = JSON.parse(window.localStorage.getItem('pinned'));
			unpinnedList = JSON.parse(window.localStorage.getItem('unpinned'));
		}
		let tempPinnedList = [];
		let tempunPinnedList = [];

		// Iterate over the pinned and unpinned array and extracting the data requested by the user.
		for (const [__, obj] of Object.entries(pinnedList)){
			let key = Object.keys(obj)[0]
			let folder = obj[key].tag;
			if (folder === tag.slice(0, 5)){
				tempPinnedList.push(obj)
			}
		}
		for (const [__, obj] of Object.entries(unpinnedList)){
			let key = Object.keys(obj)[0]
			let folder = obj[key].tag;
			if (folder === tag.slice(0, 5)){
				tempunPinnedList.push(obj)
			}
		}

		// Updating the pinned and unpinned states so that it will re-render the component updating the 
		// data in the list.
		props.updateUnpinnedList(tempunPinnedList)
		props.updatePinnedList(tempPinnedList)

		// Enabling the back button
		props.updateReturnBtnStatue()
	}

	function toggle(menu){
		if (menu.current.getAttribute("data-status") === "close"){
			menu.current.style.height = "65px";
			menu.current.setAttribute("data-status", "open");
			updateFlag(true);
		} else {
			menu.current.style.height = "0px";
			menu.current.setAttribute("data-status", "close");
			updateFlag(false);
		}
	}

	function checkForToggleClearance(menu){
		if (!flag){
			updateElement(menu);
			toggle(menu)
		} else if (menu !== element) {
			toggle(element)
			toggle(menu)
			updateElement(menu)
		} else {
			toggle(menu)
			updateElement(null)
		}
	}

	window.onclick = (e) => {
		// const src = "https://myvocabspace.web.app/icons/three-dots.svg"
		// const src = "http://localhost:3000/icons/three-dots.svg"
		const src = window.location.href + "icons/three-dots.svg"
		if (e.target.src !== src && element){
			toggle(element)
			updateElement(null)
		}
	}

	function highLight(e){
		const id = e.target.href.split("#")[1]
		let element = document.getElementById(id)
		element.style.backgroundColor = "#737373"
		setTimeout(() => {
			element.style.backgroundColor = 'transparent';
		}, 1000)
	}

	const updateStorageType = (storageType) => {
		// Updating sessionStorage useState so that we don't ask questions again and again
		setStorageQuestionAsked(true)
		console.log('Updating storage type...');
		// Updating the status in database
		updateInfo(storageType)
	}

	function fetchList(doWeHaveToUpdateInfo = false){
		if (!listFetched){
			console.log("Fetching...");
			getCollection("folders")
			.then( (resp) => {
				updateLists(resp);
				getCollection("mix")
				.then( (resp) => {
					updateLists(resp)
					if (doWeHaveToUpdateInfo){
						// update isDataStoredInLocalStorage value in firestore
						updateInfo('', 1)
					}
				})
				updateListStatus(true);
			})
			.catch(err => console.log(err))
		} else {
			console.log("Already fetched");
		}
	}

	useEffect(() => {
		// Set storage type by getting the settings applied by user in storage.
		if (questionAsked === null){
			getInfo().
			then(resp => {
				if (!resp['storageQuestion']){
					setStorageQuestionAsked(false);
				} else if(resp['storageType'] !== "sessionStorage"){
					console.log('REACHINGHERE 2....')
					// setting it to false because user selected localStorage.
					setStorageQuestionAsked(true);
					// Check if the user have stored the data in localStorage before
					if (!resp['isDataStoredInLocalStorage']){
						// Responsible for fetching data from database and updating states accordingly.
						fetchList(true)
					} else {
						console.log('No need to do API call, fetching from localStorage');
						if (window.localStorage.length == 0){
							fetchList()
							setStorageQuestionAsked(false);
						} else {
							props.updatePinnedList(JSON.parse(window.localStorage.getItem('pinned')))
							props.updateUnpinnedList(JSON.parse(window.localStorage.getItem('unpinned')))
							setStorageQuestionAsked(true);
						}
						setPinnedSortedStatus(true)
						setUnpinnedSortedStatus(true)
					}
					setQuestionAsked(true)
				} else if(resp['storageType'] === 'sessionStorage'){
					fetchList()
				}
				setStorageType(resp['storageType'])
			})
			.catch(err => console.log('ERROR!: getStatus', err))
		}

		// Sorting the pinned array
		if (tempPinnedList.length > 0 && !isPinnedArraySorted){
			console.log('sorting pinned array')
			tempPinnedList.sort((a, b) => {
				return Object.keys(a)[0].toLowerCase() > Object.keys(b)[0].toLowerCase() ? 1 : -1;
			})
			if (storageType == 'sessionStorage'){
				window.sessionStorage.setItem('pinned', JSON.stringify(tempPinnedList))
				window.localStorage.removeItem('pinned') 
			} else {
				window.localStorage.setItem('pinned', JSON.stringify(tempPinnedList))
			}
			setPinnedSortedStatus(true)
			props.updatePinnedList(prevItems => [...prevItems, ...tempPinnedList])
		}

		// Sorting unpinned array
		if (tempUnpinnedList.length > 0 && !isUnpinnedArraySorted){
			console.log('sorting unPinned array')
			tempUnpinnedList.sort((a, b) => {
				return Object.keys(a)[0].toLowerCase() > Object.keys(b)[0].toLowerCase() ? 1 : -1;
			})
			if (storageType == 'sessionStorage'){
				window.sessionStorage.setItem('unpinned', JSON.stringify(tempUnpinnedList))
				window.localStorage.removeItem('unpinned')
			} else {
				window.localStorage.setItem('unpinned', JSON.stringify(tempUnpinnedList))
			}
			setUnpinnedSortedStatus(true)
			props.updateUnpinnedList(prevItems => [...prevItems, ...tempUnpinnedList])
		}

		console.log('Executed useEffect...')
	}, [tempPinnedList, tempUnpinnedList, storageQuestionAsked]);

	return(
		<>
			<div id={styles.listContainer}>
				{/* Logic to show the storageConsent container or not */}
				{
					!storageQuestionAsked ?  <StorageConsentContainer
												updateStorageType = {updateStorageType}
												storageType = {storageType}
												/>
											: null
				}
			
				{
					
					props.pinned.map(list => {
						return(
							<List
								key = {Object.keys(list)[0]}
								data={list}
								checkForToggleClearance = {checkForToggleClearance}
								listTaggedAuthor = {listTaggedAuthor}
								highLight = {highLight}
							/>
						)
					})
				}
				{
					props.unPinned.map(list => {
						return(
								<List 
								key = {Object.keys(list)[0]}
									data={list}
									checkForToggleClearance = {checkForToggleClearance}
									listTaggedAuthor = {listTaggedAuthor}
									highLight = {highLight}
								/>
						)
					})
				}
			</div>
		</>
	);
}

const StorageConsentContainer = props => {
	
	return(
		<div className={styles.storageConsent} key="storageConsent">
			<div className={styles.closeDialogue}>
				<img src="./icons/closeIcon.svg" className={styles.closeDialogueImage} />
			</div>
			<div className={styles.storageConsentQuestion}>
				<p style={{margin: '10px'}} ><strong>How do you want your data to be stored?</strong></p>
				<ul>
					<li>
						{props.storageType === "sessionStorage" ?
							<img className={styles.checkboxImage} src="./icons/checkbox.png" onClick={e => props.updateStorageType('sessionStorage')} /> :
							<div className={styles.checkbox} onClick={e => props.updateStorageType('sessionStorage')} />
						}
						<strong>sessionStorage </strong>
						in which the data stored will be deleted after brower/application is closed.
					</li>
					<li>
						{!props.storageType === 'localStorage' ?
							<img className={styles.checkboxImage} src="./icons/checkbox.png" onClick={e => props.updateStorageType('localStorage')} /> :
							<div className={styles.checkbox} onClick={e => props.updateStorageType('localStorage')} />
						}
						<strong>localStorage </strong>
						in which the data will be stored in your device for-ever until you delete it.
					</li>
				</ul>
			</div>
		</div>
	)
}

export default ListContainer;


// 1) Pinned and unpinned props are being used in return and sorting function(in useEffect)
// 2) updateUnpinnedList and updatePinnedList update functions are being used in ..
// [updateLists, ListTaggedAuthor, useEffect] functions.