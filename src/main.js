import React, { Suspense, useState, useEffect } from "react";
import mainStyle from "./stylesheets/main.module.css"
import Navbar, {StatusLine} from "./components/topSection";
import { SearchBar,Modal } from "./components/topSection";
import AddNewTask from "./components/newTask.js";
import Fallback from './components/fallbackComp.js'
import ErrorBoundary from './components/ErrorBoundary.js';
import { ReturnStateContext } from './components/context.js'
const ListContainer = React.lazy(() => import("./components/listContainer.js"))

const Body = (props) => {
    const [returnBtnState, setReturnBtnState] = useState(false)
	let [pinned, updatePinnedList] = useState([])
	let [unPinned, updateUnpinnedList] = useState([])

    // States of NewTask component.
    let newStateStyles = useState({display: "none", transform: "scale(0)"})

    function updateReturnBtnStatue(){
        setReturnBtnState(!returnBtnState)
    }

    useEffect(() => {
        console.log(newStateStyles);
    })    

    return(
        <ErrorBoundary>
            <div id={mainStyle.OuterWrapper}>
                <AddNewTask newStateStyles={newStateStyles} />
                <Modal />
                <Navbar />
                <StatusLine />
                <div id={mainStyle.InnerWrapper}>

                    <ReturnStateContext.Provider value={returnBtnState}>
                        <SearchBar
                                pinned={pinned} u={unPinned}
                                updatePinnedList ={updatePinnedList}nPinned
                                updateUnpinnedList = {updateUnpinnedList}
                                updateReturnBtnStatue = {updateReturnBtnStatue}
                                newStateStyles={newStateStyles}
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

                    {/* <Newtask newStateStyles={newStateStyles} /> */}
                </div>
            </div>
        </ErrorBoundary>
    )
}
export default Body;