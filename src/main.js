import React, { Component, Suspense, useState } from "react";
import mainStyle from "./stylesheets/main.module.css"
import Navbar, {StatusLine} from "./components/topSection";
import { SearchBar,Modal } from "./components/topSection";
import Newtask from "./components/bottomSection";
import AddNewTask from "./components/newTask.js";
import Fallback from './components/fallbackComp.js'
import ErrorBoundary from './components/ErrorBoundary.js';
import { ReturnStateContext } from './components/context.js'
const ListContainer = React.lazy(() => import("./components/listContainer.js"))

const Body = (props) => {
    const [returnBtnState, setReturnBtnState] = useState(false)
	let [pinned, updatePinnedList] = useState([])
	let [unPinned, updateUnpinnedList] = useState([])

    function updateReturnBtnStatue(){
        setReturnBtnState(!returnBtnState)
    }

    return(
        <ErrorBoundary>
            <div id={mainStyle.OuterWrapper}>
                <AddNewTask />
                <Modal />
                <Navbar />
                <StatusLine />
                <div id={mainStyle.InnerWrapper}>

                    <ReturnStateContext.Provider value={returnBtnState}>
                        <SearchBar
                                pinned={pinned} unPinned={unPinned}
                                updatePinnedList ={updatePinnedList}
                                updateUnpinnedList = {updateUnpinnedList}
                                updateReturnBtnStatue = {updateReturnBtnStatue}
                        />
                    </ReturnStateContext.Provider>

                    <Suspense fallback={<Fallback />}>
                            <ListContainer 
                                updateReturnBtnStatue={updateReturnBtnStatue}
                                pinned={pinned} unPinned = {unPinned}
                                updatePinnedList={updatePinnedList}
                                updateUnpinnedList = {updateUnpinnedList}
                            />
                    </Suspense>

                    <Newtask />
                </div>
            </div>
        </ErrorBoundary>
    )
}
export default Body;