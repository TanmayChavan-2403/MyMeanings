import React, { Component, useRef } from 'react';
import UpdateComponent from './updateComponent.js';
import styles from '../stylesheets/bottomSection.module.css';
import { deleteListFromDB, addToCompletedList, removeFromCompletedList, updatePinStatus } from '../db/firebase.js';

class List extends Component{
	constructor(props){
		super(props);
		this.state = {
			checked: props.data[Object.keys(props.data)[0]]["isComplete"],
			key: Object.keys(props.data)[0],
			pinned: props.data[Object.keys(props.data)[0]]["pinned"],
			flag: false,
		}
		this.menu = React.createRef();
	}

	static getDerivedStateFromProps(props, state){
		return {
			key: Object.keys(props.data)[0]
		}
	}

	// returnLink() {
	// 	return <a style={{color:'white'}} onClick={this.props.highLight} href="#Pester"> link </a>
	// }

	render(){

		const key = this.state.key;

		const removeAndAppend = (child) => {
			const parent = document.getElementById(`${styles.listContainer}`)
			child.remove();
			parent.appendChild(child);
		}

		const removeAndPush = (child) => {
			const parent = document.getElementById(`${styles.listContainer}`)
			
			child.remove();
			parent.insertBefore(child, parent.firstChild)
		}

		const check = (e) => {
			// If the list is already checked then we have to uncheck and  update the DB
			if (this.state.checked){
				removeFromCompletedList(this.props.data, this.state.key)
				.then(resp => this.props.pullDownModal(resp))
				.catch(err => this.props.pullDownModal(err))
			// If it is not checked then we have to-
			} else {
				// -Add it to completed list which will also update the "isCompleted" status of
				// the corresponding meaning in its respective folder("folders" or "mix").
				addToCompletedList(this.props.data, this.state.key)
				.then(resp => {
					// If the DB was updated successfully then we have to check if it was pinned
					// if it was, then we have to unpin it and update the status in the database
					// also we have to remove the pin image off the list by updating the pinned
					// status using this.setState().
					if (this.state.pinned){
						updatePinStatus(this.props.data, this.state.key, 'unpin')
						.then(ret => {
							this.props.pullDownModal(resp)
							this.setState((state, props) => ({
								pinned: !state.pinned
							}))
						})
						.catch(err => this.props.pullDownModal(err))
					}
				})
				.catch(err => this.props.pullDownModal(err))

				// Remove the list from the curr position and append in the last position in the
				// same meaning list.
				removeAndAppend(e.target.parentElement.parentElement);
			}
			this.setState((state, props) => ({
				checked: !state.checked
			}))
		}

		const pin = (e) => {
			// Move the pinned element to top
			let child = e.target.parentElement.parentElement.parentElement.parentElement
			if (!this.state.pinned){
				updatePinStatus(this.props.data, this.state.key, 'pin')
				.then(resp => this.props.pullDownModal(resp))
				.catch(err => this.props.pullDownModal(err))
				removeAndPush(child);
			} else {
				updatePinStatus(this.props.data, this.state.key, 'unpin')
				.then(resp => this.props.pullDownModal(resp))
				.catch(err => this.props.pullDownModal(err))
				removeAndAppend(child);
			}
			
			this.props.checkForToggleClearance(this.menu)
			this.setState((state, props) => ({
				pinned: !state.pinned
			}))
		}

		const deleteList = (e) => {
			let list = e.target.parentElement.parentElement.parentElement.parentElement
			deleteListFromDB(this.state.key, this.props.data)
			.then(resp => {
				this.props.pullDownModal(resp); // Pull down modal displaying success message.
				list.remove(); // Remove from the website's UI
				this.props.checkForToggleClearance(this.menu); // toggle the menu as we have successfully deleted
			})
			.catch(err => this.props.pullDownModal(err))
		}

		return(
			<div className={styles.list} id={key}>
				<div className={styles.checkBox}>
					<div onClick={check} className={styles.radioBtn}>
						{
							this.state.checked ? 
							<img src="./icons/checkmark.svg"/> : ""
						}
					</div>
				</div>
				<div className={styles.meaning}>
					{
						this.state.checked ?
						<p> <strong>{key}</strong> - <s> {this.props.data[key]["meaning"]}</s>  </p> :
						<p> <strong>{key}</strong> - {this.props.data[key]["meaning"]}</p>
					}
				</div>
				<div className={styles.tag}>
					{
						this.props.data[key]["tag"] ?
						<div className={styles.tagName} onClick={() => this.props.listTaggedAuthor(this.props.data[key]["docId"])}>
							<p>{this.props.data[key]["tag"]}</p>
						</div> : 
						""
					}
				</div>
				<div className={styles.pin}>
					{
						this.state.pinned ?
						<img src="./icons/pin2.svg" /> : ""
					}
				</div>
				<div className={styles.menu}>
					<div className={styles.menuList} ref={this.menu} data-status="close">
						<ul>
							<li onClick={pin}
								style={{ borderBottom: "1px solid white" }}>
								<img src="./icons/pin.svg"/>
								{this.state.pinned ? "Unpin" : "Pin"}
							</li>
							<li onClick={deleteList} >
								<img src="./icons/deleteIcon.svg" />
								Delete 
							</li>
						</ul>
					</div>
					<img onClick={() => this.props.checkForToggleClearance(this.menu)} src="./icons/three-dots.svg" />
				</div>
			</div>
		);
	}
}

export default UpdateComponent(List);