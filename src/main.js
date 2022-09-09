import React, { Component } from "react";
import mainStyle from "./stylesheets/main.module.css"
import Navbar, {StatusLine} from "./components/topSection";
import { SearchBar,Modal } from "./components/topSection";
import Newtask, { ListContainer } from "./components/bottomSection";
import AddNewTask from "./components/newTask.js";

class Body extends Component{
    constructor(){
        super()
    }
    render(){
        return(
            <React.Fragment>
                <div id={mainStyle.OuterWrapper}>
                    <AddNewTask />
                    <Modal />
                    <Navbar />
                    <StatusLine />
                    <div id={mainStyle.InnerWrapper}>
                        <SearchBar />
                        <ListContainer />
                        <Newtask />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Body;