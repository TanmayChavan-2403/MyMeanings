import Body from "./main";
import React, { Component } from 'react'
import {Routes, Route, useNavigate, Router} from 'react-router-dom';
import Fallback, {ServerError} from './components/fallbackComp'
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
            console.log(resp)
            if (resp.status == 401){
                this.props.navigate('login');
            }
            this.setState({
                authenticate: false
            })
        })
        .catch(error => {
            console.log("Some error occured", error)
            if (error.message.includes('NetworkError')){
                this.setState({
                    error: "Server is down, please try again after sometime",
                    flag: true
                });
            } else {
                console.log(error);
            }
        });
    }

    updateModal(message, error = false, warning=false){
        this.setState({modalTopPosition: "10px"})
        this.setState({modalDisplayText: message})
        if (error){
            this.setState({modalMsgType: 'red'})
        } else if (warning) {
            this.setState({modalMsgType: 'yellow'})
        } else {
            this.setState({modalMsgType: 'green'})
        }
        setTimeout(()=>{
            this.setState({modalTopPosition: "-100px"})
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
                    <Route path="/" element={<Body 
                        updateModal={this.updateModal}
                        modalMsgType={this.state.modalMsgType}
                        modalDisplayText={this.state.modalDisplayText}
                        modalTopPosition={this.state.modalTopPosition}
                    />}  />
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
