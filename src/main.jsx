import React, { Suspense, useState } from "react";
import mainStyle from "./stylesheets/main.module.css"
import Navbar, {StatusLine} from "./components/topSection";
import { SearchBar,Modal } from "./components/topSection";
import AddNewTask from "./components/newTask";
import Fallback from './components/fallbackComp'
import { ReturnStateContext } from './components/context';
const ListContainer = React.lazy(() => import("./components/listContainer"))

const Body = (props) => {
    const [returnBtnState, setReturnBtnState] = useState(false)
	let [pinned, updatePinnedList] = useState([])
	let [unPinned, updateUnpinnedList] = useState([])
    let [defaultFolderName, changeDefaultFolder] = useState(sessionStorage.getItem('defaultFolder'));

    const [searchText, setSearchText] = useState("")
    const [searchResult, setSearchResult] = useState([])

    // States of NewTask component.
    let newStateStyles = useState({display: "none", transform: "scale(0)"})

    // States of Modal Component
    let [modalTopPosition, setModalTopPosition] = useState("-100px");
    let [modalMsgType, setModalMsgType] = useState('green');
    let [modalDisplayText, setModalDisplayText ] = useState("");

    function updateReturnBtnStatue(){
        setReturnBtnState(!returnBtnState)
    }

    function updateModal(message, error = false, warning=false){
        console.log(message)
        setModalTopPosition("10px")
        setModalDisplayText(message)
        if (error){
            setModalMsgType('red')
        } else if (warning) {
            setModalMsgType('yellow')
        } else {
            setModalMsgType('green')
        }
        setTimeout(()=>{
            setModalTopPosition("-100px")
        }, 3000)
    }

    return(
            <div id={mainStyle.OuterWrapper}>
                <AddNewTask newStateStyles={newStateStyles} updateModal={updateModal} />
                <Modal modalTopPosition={modalTopPosition}
                      modalDisplayText={modalDisplayText}
                      modalMsgType = {modalMsgType}
                />
                <Navbar />
                <StatusLine />
                <div id={mainStyle.InnerWrapper}>

                    <ReturnStateContext.Provider value={returnBtnState}>
                        <SearchBar
                                pinned={pinned} 
                                unPinned={unPinned}
                                updatePinnedList ={updatePinnedList}
                                updateUnpinnedList = {updateUnpinnedList}
                                updateReturnBtnStatue = {updateReturnBtnStatue}
                                newStateStyles={newStateStyles}
                                updateModal = {updateModal}
                                setSearchText = {setSearchText}
                                searchText = {searchText}
                                setSearchResult={setSearchResult}
                                defaultFolderName={defaultFolderName}
                                changeDefaultFolder={changeDefaultFolder}
                        />
                    </ReturnStateContext.Provider>

                    <Suspense fallback={<Fallback />}>
                        <ListContainer 
                            updateReturnBtnStatue={updateReturnBtnStatue}
                            pinned={pinned} unPinned = {unPinned}
                            updatePinnedList={updatePinnedList}
                            updateUnpinnedList = {updateUnpinnedList}
                            updateModal={updateModal}
                            searchResult = {searchResult}
                            searchText= {searchText}
                            defaultFolderName={defaultFolderName}
                        />
                    </Suspense>

                    {/* <Newtask newStateStyles={newStateStyles} /> */}
                </div>
            </div>
    )
}
export default Body;