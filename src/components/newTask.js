import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import styles from "../stylesheets/main.module.css";
import { storeDataInDb, getFolderInfo } from "../db/firebase.js";


const AddNewTask = (props) => {
	const [word, updateWord] = useState("");
	const [pinned, updatePin] = useState(false);
	const [meaning, updateMeaning] = useState("");
	const [folderNames, updateFolderNames] = useState([]);
	const [folderName, updateFolderName ] = useState("mix");
	const [isNewfolder, updateisNewFolder] = useState(false);
	const [tooltipState, setTooltipState] = useState({opacity: '0'})

	useEffect(() => {
		getFolderInfo()
		.then(data => updateFolderNames(data.names))
		.catch(err => console.log(err))
	}, [])

	function toggleFolderList(e){
		let list  = document.getElementsByClassName(`${styles.folderList}`)[0];
		let image = document.getElementsByClassName(`${styles.arrowIcon}`)[0];
		let state = list.getAttribute("data-state");
		if (state == "close"){
			image.style.transform = "rotate(180deg)";
			list.style.height = "200px";
			list.setAttribute("data-state", "open")	
		} else {
			list.style.height = "0px";
			image.style.transform = "rotate(0deg)";
			list.setAttribute("data-state", "close")
		}
	}

	function submit(e){
		if (word.length !== 0 && meaning.length !== 0 && folderName.length !== 0){
			storeDataInDb({word, meaning, pinned, folderName, isNewfolder})
			.then(resp => {
				// RESETTING the default values of the input field
				updateWord("");
				updateMeaning("")
				updatePin(false)
				props.updateModal(resp);
				props.newStateStyles[1]({display: "none", transform: "scale(0)"})
			})
			.catch(err => {
				console.log('ERROR here')
				props.updateModal(err, true)
			})
		} else {
			props.updateModal("Please check all fields are filled properly", false, true);
		}
	}

	document.onkeypress = (e) => {
		if (e.charCode == 13){
			submit();
		}
	}

	function selectFolder(e=undefined, name=undefined){
		if (name === "From Image"){
			updateFolderName(e.target.previousSibling.value);
			updateisNewFolder(true);
			toggleFolderList();
		}
		else if (e && (e.code == "NumpadEnter" || e.code == "Enter")){
			if (e.target.value.length !== 0){
				console.log('Clicked 1');
				updateFolderName(e.target.value);
				updateisNewFolder(true);
				toggleFolderList();
			}
		} else if(!e){
			console.log(name);
			updateFolderName(name);
			updateisNewFolder(false);
			toggleFolderList();	
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
					<img onClick={(e) => props.newStateStyles[1]({display: "none", transform: "scale(0)"})} src="./icons/closeIcon.svg" />
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
						<img className={styles.clearIcon} onClick={(e) => updateMeaning("")} src='./icons/crossMark.png' />
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
						<div onClick={toggleFolderList} className={styles.folderName}>
							<p styles={{pointerEvents: "none"}}> {folderName}</p>
							<img className={styles.arrowIcon} src="./icons/downArrow.png" />
						</div>
						<div data-state="close" className={styles.folderList}>
							<ul>
								<li>
								<input onKeyPress={selectFolder} placeholder="Create New [Type & hit enter]" />
								<img onClick={(e) => selectFolder(e, "From Image")} id = {styles.enter}src="./icons/enterBlack.svg"></img>
								</li>
								{folderNames.map(folder => {
									return(
										<li key={folder} onClick={() => selectFolder("", folder)}>{folder}</li>
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