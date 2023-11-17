import Body from "./main";
import React, { Component } from 'react'
import {Routes, Route, useNavigate, Router} from 'react-router-dom';
import Fallback, {ServerError} from './components/fallbackComp'
import Login from "./components/login";
import Profile from "./components/profile";
import Preloader from './components/preloader';

class App extends Component{
    constructor(props){
        super(props);
        this.state ={
            error: null,
            flag: false,
            authenticate: true
        }
    }

    componentDidMount(){
        fetch(`${process.env.REACT_APP_SERVERURL}/firstVisit`, {
            method: 'GET',
            credentials: "include",
            headers:{
                'Content-type': "application/json"
            }
        })
        .then(resp => {
            if (resp.status == 401){
                this.props.navigate('login');
            }
            setTimeout(() => {
                this.setState({
                    authenticate: false
                })
            }, 3000)
        })
        .catch(error => {
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
                    <Route path="/" element={<Body />}  />
                    <Route path="login" element={<Login />} />
                    <Route path="profile" element={<Profile />} />
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
