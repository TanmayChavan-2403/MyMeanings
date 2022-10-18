import styles from '../stylesheets/bottomSection.module.css';
import { useEffect, useState, useRef } from 'react'
import AddNewTask from "./newTask.js";
import UpdateComponent from './updateComponent.js';


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