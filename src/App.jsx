import Body from "./main";
import React, { Component } from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom';
import {ServerError} from './components/fallbackComp'
import Login from "./components/login";
import Profile from "./components/profile/profile";
import Preloader from './components/preloader';

class App extends Component{
    constructor(props){
        super(props);
        this.state ={
            error: null,
            flag: false,
            authenticate: true,
            modalTopPosition: "-100px",
            modalMsgType: 'green',
            modalDisplayText: ''
        }
        this.updateModal = this.updateModal.bind(this);
    }

    componentDidMount(){
        console.log("App.jsx mounted..")
        fetch(`${process.env.REACT_APP_SERVERURL}/firstVisit`, {
            method: 'GET',
            credentials: "include",
            headers:{
                'Content-type': "application/json"
            }
        })
        .then(resp => {
            if (resp.status === 401){
                this.props.navigate('login');
                this.setState({authenticate: false})
            } else if (resp.status === 202){
                this.setState({authenticate: true})
                return resp.json();
            } else if (resp.status === 500){
                throw new Error("")
            }
        })
        .then(data => {
            if (data){
                window.sessionStorage.setItem('newNotif',data.payload.newNotificationReceived);
                window.sessionStorage.setItem('pinCount',data.payload.pinCount);
                window.sessionStorage.setItem('username',data.payload.username);
                window.sessionStorage.setItem('defaultFolder',data.payload.defaultFolder);
                window.sessionStorage.setItem('email',data.payload.email);
                window.sessionStorage.setItem('folders', JSON.stringify(data.payload.folders));
                window.sessionStorage.setItem('categories', JSON.stringify(data.payload.categories));
                window.sessionStorage.setItem('notificationTurnedOn', data.payload.notificationTurnedOn)
                this.setState({authenticate: false})
            }
        })
        .catch(error => {
            console.log("Some error occured", error)
            if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')){
                this.setState({
                    error: "Server under maintainance",
                    flag: true
                });
            } else {
                console.log(error);
            }
        });
    }

    updateModal(message, error = false, warning=false, info=false){
        this.setState({modalTopPosition: "10px"})
        this.setState({modalDisplayText: message})
        if (error){
            this.setState({modalMsgType: 'red'})
        } else if (warning) {
            this.setState({modalMsgType: 'yellow'})
        } else if (info){
            this.setState({modalMsgType: '#1e90ff'})
        } else {
            this.setState({modalMsgType: 'green'})
        }
        setTimeout(()=>{
            this.setState({modalTopPosition: "-100px"})
            setTimeout(() => {
                this.setState({modalDisplayText: ""})
            }, 300)
        }, 3000)
    }

    render(){
        if (this.state.flag){
            return (
                <ServerError message={this.state.error}/>
            );
        } else if(this.state.authenticate){
            return(
                <Preloader />
            )
        }
        else {
            return(
                <Routes>
                    <Route path="/" element={
                            <Body 
                                updateModal={this.updateModal}
                                modalMsgType={this.state.modalMsgType}
                                modalDisplayText={this.state.modalDisplayText}
                                modalTopPosition={this.state.modalTopPosition}
                            />
                        }
                    />
                    <Route path="login" element={<Login />} />
                    <Route path="profile" element={<Profile
                        updateModal={this.updateModal}
                        modalMsgType={this.state.modalMsgType}
                        modalDisplayText={this.state.modalDisplayText}
                        modalTopPosition={this.state.modalTopPosition}
                    />} />
                </Routes>
            )
        }
    }
}

function RouterWrapper(props){
    const navigate = useNavigate();
    return <App {...props} navigate={navigate} />
}

export default RouterWrapper;
