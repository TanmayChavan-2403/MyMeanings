import React from 'react';
import styles from "../stylesheets/main.module.css";

const UpdateComponent = OriginalComponent => {
	class NewComponent extends React.Component {

		mountUnmount = () => {
			let container = document.getElementById("portals").children[0];
			if (container.getAttribute("data-status") == "close"){
				let input = container.getElementsByClassName(`${styles.inputContainer}`)[0]
				if (input === undefined){
					input = container.getElementsByClassName(`${styles.inputContainer}`)[1]
				}
				container.style.display = 'flex';
				container.style.transform = "scale(1)";
				container.setAttribute("data-status", "open");
			} else{
				container.style.display = 'none';
				container.style.transform = "scale(0)";
				container.setAttribute("data-status", "close");
			}
		}

		pullDown = (text) => {
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

		render(){
			return <OriginalComponent
				menu = {this.props.menu}
				data = {this.props.data}
				pullDownModal = {this.pullDown}
				mountUnmount={this.mountUnmount}
				checkForToggleClearance = {this.props.checkForToggleClearance}
				listTaggedAuthor = {this.props.listTaggedAuthor}
				highLight = {this.props.highLight}
			/>
		}
	}

	return NewComponent;
}


export default UpdateComponent;