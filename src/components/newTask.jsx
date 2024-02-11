import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import styles from "../stylesheets/main.module.css";
import { useNavigate } from 'react-router-dom';


const AddNewTask = (props) => {
	const [word, updateWord] = useState("");
	const [pinned, updatePin] = useState(false);
	const notify = true
	const [meaning, updateMeaning] = useState("");
	
	// Folder drop down states
	const [droppedContainer, updateDroppedContainerName] = useState('');
	const activeDropDown = {height: "200px"}
	const deactiveDropdown = {height: "0px"}

	const [categoryName, udpateCategoryName] = useState('mix');
	const [folderName, updateFolderName] = useState(window.sessionStorage.getItem('defaultFolder'));

	const folderNames = JSON.parse(window.sessionStorage.getItem('folders')) || [];
	const categoryNames= JSON.parse(window.sessionStorage.getItem('categories')) || [];

	const [tooltipState, setTooltipState] = useState({opacity: '0'})
	const navigate = useNavigate();

	useEffect(() => {
		if (categoryName === ""){
			udpateCategoryName('mix');
		} else if (folderName === ""){
			updateFolderName(window.sessionStorage.getItem('defaultFolder'))
		}
		// getFolderInfo()
		// .then(data => updateFolderNames(data.names))
		// .catch(err => console.log(err))
	}, [categoryName, folderName])

	function toggleDropdowns(name){
		if (name ===  droppedContainer){
			updateDroppedContainerName('');	
		} else {
			updateDroppedContainerName(name);
		}
	}

	const presentInRecord = (type) =>{
		let arr = JSON.parse(sessionStorage.getItem(type));
		for(let i = 0; i < arr.length; i++){
			if (type === 'folders'){
				if (folderName === arr[i]){
					return true;
				}
			} else {
				if (categoryName === arr[i]){
					return true;
				}
			}
		}
		console.log(type + 'not present update databaes');
		return false
	}

	function submit(e){
		if (word.length !== 0 && meaning.length !== 0 && categoryName.length !== 0){
			// Preparing payload according to the data extracted by the backend.
			let payload = {
				word,
				tagName: categoryName,
				folderName: folderName,
				meaning,
				pin: pinned,
				complete: false,
				notify
			}
			fetch(`${process.env.REACT_APP_SERVERURL}/addData`,{ 
	            method: "POST",
	            headers:{
	                'Content-type': 'application/json'
	            },
	            credentials: "include",
	            body: JSON.stringify(payload)
	        })
	        .then(resp => {
	        	if (resp.status === 401){
	        		navigate('/login');
	        	} else{
	        		return resp.json();
	        	}
	        })
	        .then(response => {
				// RESETTING the default values of the input field
	        	updateWord("");
				updateMeaning("")
				updatePin(false)
				// Displaying message using modal.
	        	props.updateModal(response.message)
	        	// Hiding the addNewtask container
				props.newStateStyles[1]({display: "none", transform: "scale(0)"})
				if (!presentInRecord('folders')){
					updateSupplementaryDetails("folders");
				}
				if (!presentInRecord('categories')){
					updateSupplementaryDetails('categories');
				}
	        })
	        .catch(err => {
	        	console.log(err.status)
	        	props.updateModal(err.message)
	        });
		} else {
			props.updateModal("Please check all fields are filled properly", false, true);
		}
	}

	const updateSupplementaryDetails = (field) => {
		let payload = {
			field,
			newValue: field === "folders" ? folderName : categoryName
		}
		fetch(`${process.env.REACT_APP_SERVERURL}/udpateSuppDetail`,{
			method: "POST",
	            headers:{
	                'Content-type': 'application/json'
	            },
	            credentials: "include",
	            body: JSON.stringify(payload)
		})
		.then(response => response.json())
		.then(resp => console.log(resp))
		.catch(err => console.log(err));
	}

	document.onkeypress = (e) => {
		if (e.charCode === 13){
			submit();
		}
	}

	function selectFolder(type, name){
		if (type === 'category'){
			udpateCategoryName(name);
		} else {
			updateFolderName(name);
		}
	}

	function pasteTextInInputField(){
		
		navigator.permissions.query({ name: "clipboard-read" })
		.then(result => {
			navigator.clipboard.readText()
			.then(clipText => {
				updateMeaning(clipText);
				setTooltipState({opacity: '0'})
			});
		})
		.catch(err => console.log(err))
	}

	return ReactDOM.createPortal(
		<div id={styles.taskBgSupport} style={props.newStateStyles[0]}>
			<div id={styles.taskContainer}>
				<div className={styles.closeBtnContainer}>
					<img alt='close' onClick={(e) => props.newStateStyles[1]({display: "none", transform: "scale(0)"})} src="./icons/closeIcon.svg" />
				</div>
				<div className={styles.globalInputContainer}>
					<div className={styles.inputContainer1}>
						<input onChange={(e) => updateWord(e.target.value)} value={word} type="text" placeholder="word"/>
					</div>
					<div className={styles.inputContainer2}>
						<span onClick={pasteTextInInputField} style={tooltipState} className={styles.toolTip}>Paste here! 👇</span>
						<input 
							onBlur={(e) => setTooltipState({opacity: '0'})}
							onClick={(e) => setTooltipState({opacity: '1'})}
							onChange={(e) => {
								updateMeaning(e.target.value);
								e.target.value === "" ? setTooltipState({opacity: '1'}) : setTooltipState({opacity: '0'})
							}}
						value={meaning} type="text" placeholder="meaning"/>
						<img alt='close' className={styles.clearIcon} onClick={(e) => updateMeaning("")} src='./icons/crossMark.png' />
					</div>
				</div>
				<div className={styles.settings}>
					<div className={styles.pin} data-status="no">
						<p>Pin?</p>
						<div className={styles.radioButton} onClick={() => updatePin(false)}>
							{!pinned ? 
								<div style={{backgroundColor: 'red'}}></div> : 
								<div style={{backgroundColor: '#242424'}}></div>
							}
						</div>
						<div className={styles.radioButton} onClick={() => updatePin(true)}>
							{pinned ? 
								<div style={{backgroundColor: 'green'}}></div> : 
								<div style={{backgroundColor: '#242424'}}></div>
							}
						</div>
					</div>


					<div className={styles.folderSelection}>
						<div onClick={() => toggleDropdowns('category')} className={styles.folderName}>
							<p styles={{pointerEvents: "none"}}> {categoryName} </p>
							<img alt='down arrow' className={styles.arrowIcon} src="./icons/downArrow.png" />
						</div>
						<div data-state="close" style={droppedContainer === 'category' ? activeDropDown : deactiveDropdown} className={styles.folderList}>
							<ul>
								<li>
									<input onChange={(e) => udpateCategoryName(e.target.value)} placeholder="Create New [Type & hit enter]" />
									<img alt='enter' onClick={(e) => selectFolder(e, "From Image")} id = {styles.enter}src="./icons/enterBlack.svg"></img>
								</li>
								{categoryNames.map(folder => {
									return(
										<li key={folder} onClick={() => selectFolder("category", folder)}>{folder}</li>
									)
								})}
							</ul>
						</div>
					</div>



					<div className={styles.folderSelection}>
						<div onClick={() => toggleDropdowns('folder')} className={styles.folderName}>
							<p styles={{pointerEvents: "none"}}> {folderName} </p>
							<img alt='down arrow' className={styles.arrowIcon} src="./icons/downArrow.png" />
						</div>
						<div data-state="close" style={droppedContainer === 'folder' ? activeDropDown : deactiveDropdown} className={styles.folderList}>
							<ul>
								<li>
								<input onChange={(e) => updateFolderName(e.target.value)} placeholder="Create New [Type & hit enter]" />
								<img onClick={(e) => selectFolder(e, "From Image")} id = {styles.enter}src="./icons/enterBlack.svg" alt='enter'></img>
								</li>
								{folderNames.map(folder => {
									return(
										<li key={folder} onClick={() => selectFolder("folder", folder)}>{folder}</li>
									)
								})}
							</ul>
						</div>
					</div>
				</div>
				<div className={styles.submitBtnContainer}>
					<button id={styles.submit} onClick={submit}>
						Done
					</button>
				</div>
			</div>
		</div>,
		document.getElementById("portals")
	)
}

export default AddNewTask;



// Movie, Sarah Naughton, Derek Landy, Greg Weismen, Jeffery Archer, John Grisham, David Baldacci