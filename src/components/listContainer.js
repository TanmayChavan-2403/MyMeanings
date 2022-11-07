// import List from './list';
import React, { Suspense, useState, useEffect, useRef } from 'react';
import styles from '../stylesheets/bottomSection.module.css';
import { getCollection, getInfo, updateInfo } from "../db/firebase";
import Fallback from './fallbackComp.js'
const List = React.lazy(() => import('./list'))

const ListContainer = (props) => {
	let [unPinned, updateUnpinnedList] = useState([])
	let [pinned, updatePinnedList] = useState([])
	let [listFetched, updateListStatus] = useState(false);
	let [element, updateElement] = useState(null);
	let [flag, updateFlag] = useState(false);
	let [storageQuestionAsked, setStorageQuestionAsked] = useState(true)
	let [storageType, setStorageType] = useState("sessionStorage");
	let [questionAsked, setQuestionAsked] = useState(null)
	let [isPinnedArraySorted, setPinnedSortedStatus] = useState(false);
	let [isUnpinnedArraySorted, setUnpinnedSortedStatus] = useState(false);

	const updateLists = (param, tagged=false) => {
		let tempPinnedList = []
		let tempUnpinnedList = []
		console.log('Updating list.');
		if (tagged) {
			// To empty the list before filling in the tagged list where all the meanings
			// of same author will be displayed
			updatePinnedList([]);
			updateUnpinnedList([]);
			for (const prop in param.data()){
				if (param.data()[prop]["pinned"]) {
					// updatePinnedList(oldElements => [...oldElements, {[prop]: param.data()[prop]}])
					tempPinnedList.push({[prop]: param.data()[prop]})
				} else {
					// updateUnpinnedList(oldElements => [...oldElements, {[prop]: param.data()[prop]}])
					tempUnpinnedList.push({[prop]: param.data()[prop]})
				}	
			}
		} else {
			// Iterating through the response and seperating the pinned and unpinned data
			param.forEach( (data) => {
				for (const prop in data.data()){
					if (data.data()[prop]["pinned"]) {
						// updatePinnedList(oldElements => [...oldElements, {[prop]: data.data()[prop]}])
						tempPinnedList.push({[prop]: data.data()[prop]})
					} else {
						// updateUnpinnedList(oldElements => [...oldElements, {[prop]: data.data()[prop]}])
						tempUnpinnedList.push({[prop]: data.data()[prop]})
					}
				}
			})
		}
		updatePinnedList(prevItems => [...prevItems, ...tempPinnedList])
		updateUnpinnedList(prevItems => [...prevItems, ...tempUnpinnedList])
	}

	const listTaggedAuthor = (tag) => {
		console.log(`Listing tagged author's list ${tag}`);
		getCollection("folders", tag)
		.then(resp => {
			if (resp.exists()){
				// console.log(resp.data());
				updateLists(resp, true)
			} else {
				console.log('ERROR!');
			}
			// updateLists(resp, true);
		})
		.catch(err => console.log(err))
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
		const src = "http://localhost:3000/icons/three-dots.svg"
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
						console.log('Updating isDataStoredInLocalStorage')
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
					setStorageQuestionAsked(true);
				} else if(resp['storageType'] !== "sessionStorage"){
					// setting it to false because use selected localStorage.
					setStorageQuestionAsked(false);
					// Check if the user have stored the data in localStorage before
					if (!resp['isDataStoredInLocalStorage']){
						// Responsible for fetching data from database and updating states accordingly.
						fetchList(true)
					} else {
						console.log('No need to do API call, fetching from localStorage');
						updatePinnedList(JSON.parse(window.localStorage.getItem('pinned')))
						updateUnpinnedList(JSON.parse(window.localStorage.getItem('unpinned')))
						setPinnedSortedStatus(true)
						setUnpinnedSortedStatus(true)
					}
					setQuestionAsked(true)
				} else if(resp['storageType'] === 'sessionStorage'){
					console.log('log 3')
					fetchList()
				}
				setStorageType(resp['storageType'])
			})
			.catch(err => console.log('ERROR!: getStatus', err))
		}

		// Sorting the pinned array
		if (pinned.length > 0 && !isPinnedArraySorted){
			console.log('sorting pinned array')
			pinned.sort((a, b) => {
				return Object.keys(a)[0].toLowerCase() > Object.keys(b)[0].toLocaleLowerCase()
			})
			if (storageType == 'sessionStorage'){
				window.sessionStorage.setItem('pinned', JSON.stringify(pinned))
				window.localStorage.removeItem('pinned') 
			} else {
				window.localStorage.setItem('pinned', JSON.stringify(pinned))
			}
			setPinnedSortedStatus(true)
		}

		// Sorting unpinned array
		if (unPinned.length > 0 && !isUnpinnedArraySorted){
			console.log('sorting unPinned array')
			unPinned.sort((a, b) => {
				return Object.keys(a)[0].toLowerCase() > Object.keys(b)[0].toLocaleLowerCase()
			})
			if (storageType == 'sessionStorage'){
				window.sessionStorage.setItem('unpinned', JSON.stringify(unPinned))
				window.localStorage.removeItem('unpinned')
			} else {
				window.localStorage.setItem('unpinned', JSON.stringify(unPinned))
			}
			setUnpinnedSortedStatus(true)
		}

		console.log('Executed useEffect...')
	}, [pinned, unPinned, storageQuestionAsked]);

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
					
					pinned.map(list => {
						return(
								<List 
									data={list}
									checkForToggleClearance = {checkForToggleClearance}
									listTaggedAuthor = {listTaggedAuthor}
									highLight = {highLight}
								/>
							
						)
					})
				}
				{
					unPinned.map(list => {
						return(
							<Suspense fallback={<Fallback />}>
								<List 
									data={list}
									checkForToggleClearance = {checkForToggleClearance}
									listTaggedAuthor = {listTaggedAuthor}
									highLight = {highLight}
								/>
							</Suspense>
						)
					})
				}
			</div>
		</>
	);
}

const StorageConsentContainer = props => {
	
	return(
		<div className={styles.storageConsent}>
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