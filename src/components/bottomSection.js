import styles from '../stylesheets/bottomSection.module.css';
import { requestPermission, getDataFromDb, getCollection } from "../db/firebase";
import { useEffect, useState, useRef } from 'react'
import AddNewTask from "./newTask.js";
import List from './list';
import UpdateComponent from './updateComponent.js';

export const ListContainer = (props) => {
	let [unPinned, updateUnpinnedList] = useState([])
	let [pinned, updatePinnedList] = useState([])
	let [completed, updateCompleted] = useState([])
	let [listFetched, updateListStatus] = useState(false);
	let [element, updateElement] = useState(null);
	let [flag, updateFlag] = useState(false);

	const updateLists = (param, tagged=false) => {
		if (tagged) {
			// To empty the list before filling in the tagged list where all the meanings
			// of same author will be displayed
			updatePinnedList([]);
			updateUnpinnedList([]);
			for (const prop in param.data()){
				if (param.data()[prop]["pinned"] && param.data()[prop]["isComplete"] || 
					!param.data()[prop]["pinned"] && param.data()[prop]["isComplete"]) {
					updateCompleted(oldElements => [...oldElements, {[prop]: param.data()[prop]}])
				} else if (param.data()[prop]["pinned"]) {
					updatePinnedList(oldElements => [...oldElements, {[prop]: param.data()[prop]}])
				} else {
					updateUnpinnedList(oldElements => [...oldElements, {[prop]: param.data()[prop]}])
				}	
			}
		} else {
			// Iterating through the response and seperating the pinned and unpinned data
			param.forEach( async (data) => {
				for (const prop in data.data()){
					if (data.data()[prop]["pinned"] && data.data()[prop]["isComplete"] || 
					!data.data()[prop]["pinned"] && data.data()[prop]["isComplete"]) {
						updateCompleted(oldElements => [...oldElements, {[prop]: data.data()[prop]}])
					} else if (data.data()[prop]["pinned"]) {
						updatePinnedList(oldElements => [...oldElements, {[prop]: data.data()[prop]}])
					} else {
						updateUnpinnedList(oldElements => [...oldElements, {[prop]: data.data()[prop]}])
					}	
				}
			})
		}
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
		const src = "https://myvocabspace.web.app/icons/three-dots.svg"
		// const src = "http://localhost:3000/icons/three-dots.svg"
		if (e.target.src !== src && element){
			toggle(element)
			updateElement(null)
		}
	}

	useEffect(() => {
		if (!listFetched){
			console.log("Fetching...");
			getCollection("folders")
			.then( (resp) => {
				updateLists(resp);
				getCollection("mix")
				.then(resp => {
					updateLists(resp);
				})
			})
			.catch(err => console.log(err))
			updateListStatus(true);
		} else {
			console.log("Already fetched");
		}
	}, [unPinned, pinned]  );

	return(
		<>
			<div id={styles.listContainer}>
				{
					pinned.map(list => {
						return(
							<List 
								data={list}
								checkForToggleClearance = {checkForToggleClearance}
								listTaggedAuthor = {listTaggedAuthor}
							/>
						)
					})
				}
				{
					unPinned.map(list => {
						return(
							<List 
								data={list}
								checkForToggleClearance = {checkForToggleClearance}
								listTaggedAuthor = {listTaggedAuthor}
							/>
						)
					})
				}
				{
					completed.map(list => {
						return(
							<List 
								data={list}
								checkForToggleClearance = {checkForToggleClearance}
								listTaggedAuthor = {listTaggedAuthor}
							/>
						)
					})
				}					
			</div>
		</>
	);
}

const Newtask = (props) => {

	window.onkeypress = (e) => {
		if (e.charCode == 96){
			props.mountUnmount()
		}
	}

	return(
		<>
			<div className={styles.newTask}>
				<button id={styles.newTaskBtn} onClick={props.mountUnmount}>
				{/*<button id={styles.newTaskBtn} onClick={requestPermission}>*/}
					<span style={{fontSize: "1.3rem", margin: "0px 4px"}}>+</span>
					<p> New Task </p>
				</button>
			</div>
		</>
	)
}

export default UpdateComponent(Newtask);