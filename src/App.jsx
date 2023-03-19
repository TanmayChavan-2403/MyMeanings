import Body from "./main";
import React, { Component } from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom';
import Fallback, {ServerError} from './components/fallbackComp'
import Login from "./components/login";

class App extends Component{
    constructor(props){
        super(props);
        this.state ={
            error: null,
            flag: false,
        }
    }

    componentDidMount(){
        fetch('http://localhost:4000/firstVisit', {
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
        }
        else {
            return(
                <Routes>
                    <Route path="/" element={<Body />}  />
                    <Route path="login" element={<Login />} />
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
