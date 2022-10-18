import React, { Component, Suspense } from "react";
import mainStyle from "./stylesheets/main.module.css"
import Navbar, {StatusLine} from "./components/topSection";
import { SearchBar,Modal } from "./components/topSection";
import Newtask from "./components/bottomSection";
import AddNewTask from "./components/newTask.js";
import Fallback from './components/fallbackComp.js'
import ErrorBoundary from './components/ErrorBoundary.js';
const ListContainer = React.lazy(() => import("./components/listContainer.js"))


class Body extends Component{
    constructor(){
        super()
    }
    render(){
        return(
            <ErrorBoundary>
                <div id={mainStyle.OuterWrapper}>
                    <AddNewTask />
                    <Modal />
                    <Navbar />
                    <StatusLine />
                    <div id={mainStyle.InnerWrapper}>
                        <SearchBar />
                        <Suspense fallback={<Fallback />}>
                            <ListContainer />
                        </Suspense>
                        <Newtask />
                    </div>
                </div>
            </ErrorBoundary>
        )
    }
}

export default Body;