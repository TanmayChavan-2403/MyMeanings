// import List from './list';
import React, { useState, useEffect } from 'react';
import styles from '../stylesheets/bottomSection.module.css';
import { useNavigate } from 'react-router-dom';
const List = React.lazy(() => import('./list'))

const ListContainer = (props) => {
	let [flag, updateFlag] = useState(false);
	let [element, updateElement] = useState(null);
	let [page, nextPage] = useState(1);
	let [endOfData, setEndOfData] = useState(false);
	let navigate = useNavigate();

	const listTaggedAuthor = (tag) => {
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

	async function filterData(array){
		let pinnedTempStorage = []
		let unpinnedTempStorage = []
		for(let data of array){
			if (data.isPinned){
				pinnedTempStorage.push(data);
			} else {
				unpinnedTempStorage.push(data);
			}
		}
		return [pinnedTempStorage, unpinnedTempStorage];
	}

	function loadMore(){
		fetchData(page + 1);
		// nextPage(prevPage => (prevPage + 1));
	}

	function fail() {
		return new Promise((resolve, reject) => {
			reject(new Error("Something went wrong"));
		});
	}

	function fetchData(payload){
		nextPage(payload);
		// let defaultFolder = sessionStorage.getItem('defaultFolder');
		fetch(`http://localhost:4000/getList?page=${payload}&limit=20&defaultFolder=${props.defaultFolderName}`, {
			method: "GET",
			credentials: "include"
		})
		.then(res => {
			if (res.status == 401){
				navigate('/login');
				return fail();
			} else {
				return res.json();
			}
		})
		.then( async (data) => { //Returns object which contains status, resultCount and response fields
						
			if (data.resultCount === 0){
				setEndOfData(true);
			} else {
				let resp = await filterData(data.response);
				props.updatePinnedList(prevItems => [...prevItems, ...resp[0]]);
				props.updateUnpinnedList(prevItems => [...prevItems, ...resp[1]]);
			}
		})
		.catch(err => console.log(err));
	}

	useEffect(() => {
		fetchData(0);
		props.updatePinnedList([]);
		props.updateUnpinnedList([]);
	}, [props.defaultFolderName]);

	return(
		<>
			{props.searchText.length === 0 ? null :
			<div id={styles.searchListContainer}>
				<div id={styles.SLWrapper}>
					{
						props.searchResult.length === 0 ?
							<div id={styles.emptyContainer}>
								<img src="./emptyResult.png" alt='No results found image'/>
								<h1>No data found ☹</h1>
							</div> 
						:
						props.searchResult.map(list => {
							return(
								<List
									key = {list['_id']}
									data={list}
									checkForToggleClearance = {checkForToggleClearance}
									listTaggedAuthor = {listTaggedAuthor}
									highLight = {highLight}
									updateModal={props.updateModal}
								/>
							)
						})
					}
				</div>
			</div>
			}
			<div id={styles.listContainer}>
				{
					props.pinned.map(list => {
						return(
							<List
								key = {list['_id']}
								data={list}
								checkForToggleClearance = {checkForToggleClearance}
								listTaggedAuthor = {listTaggedAuthor}
								highLight = {highLight}
								updateModal={props.updateModal}
							/>
						)
					})
				}
				{
					props.unPinned.map(list => {
						return(
								<List 
								key = {list['_id']}
									data={list}
									checkForToggleClearance = {checkForToggleClearance}
									listTaggedAuthor = {listTaggedAuthor}
									highLight = {highLight}
									updateModal={props.updateModal}
								/>
						)
					})
				}
				{
					endOfData ?
					 null : 
					<div id = {styles.loadMore}  style={{width: '100%'}}>
						<p onClick={loadMore} >Load More</p>
						<img  onClick={loadMore} src='./icons/refresh.png' alt='Refresh Icon'></img>
					</div>

				}
			</div>
		</>
	);
}



export default ListContainer;


/*
// 1) Pinned and unpinned props are being used in return and sorting function(in useEffect)
// 2) updateUnpinnedList and updatePinnedList update functions are being used in ..
// [updateLists, ListTaggedAuthor, useEffect] functions.


// TODO's
// 1) Remove normal sorting and group all the words/meanings starting with first letter
//	  togeter
// 2) Add right-side vertical bar extending from top to bottom.
// 3) Improve delete functionality by also removing it from UI.
*/