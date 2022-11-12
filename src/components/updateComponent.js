import React from 'react';
import styles from "../stylesheets/main.module.css";

const UpdateComponent = OriginalComponent => {
	class NewComponent extends React.Component {

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