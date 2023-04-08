import '../stylesheets/login.css'
import { useNavigate } from 'react-router-dom';
const { Component } = require("react");


class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            confirmPassword:'',
            heading: 'LOGIN',
            properties: {
                display: 'flex',
                pointerEvents:'all'
            },
            confirmLoginField: {height: "0px", padding: '0px'},
            login: true,
            question: "Not a member ?"
        }
        this.submit = this.submit.bind(this);
    }

    updateState(field, event){
        this.setState({
            [field]: event.target.value
        })
    }

    changeOptions(){
        if (this.state.login){
            let transitions = ["ROGIN", "REGIN", "REGIS", "REGIST","REGISTE", "REGISTER","REGISTER NOW!"];
            let time = 400;
            for(let i = 0; i < transitions.length; i++){
                if (i == 6){
                    time = 450;
                }
                setTimeout(() => {
                    this.setState({
                        heading: transitions[i]
                    })

                }, i* time);
            }
            this.setState({
                confirmLoginField: {height: "44px", padding: '12px'},
                question: "Already a member ?",
                login: !this.state.login
            })
        } else {
            let transitions = [" _ ", " __ ", " ___ ", " ____ ", " ____ "," _____ ", "LOGIN"];
            let time = 350;
            for(let i = 0; i < transitions.length; i++){
                if (i == 6){
                    time = 450;
                }
                setTimeout(() => {
                    this.setState({
                        heading: transitions[i]
                    })

                }, i* time);
            }
            this.setState({
                confirmLoginField: {height: "0px", padding: '0px'},
                question: "Not a member ?",
                login: !this.state.login
            })
        }
    }

    closeContainer(){
        this.setState({
            properties:{
                display: 'none',
                pointerEvents: 'none'
            }
        })
    }

    submit(){
        if (this.state.username.trim().length == 0){
            alert("Please enter proper username");
            return;
        } else if (!this.state.login && this.state.password != this.state.confirmPassword){
            alert("Confirm Password does not match with password");
            return;
        }
        if (!this.state.login){
            fetch('http://localhost:4000/register', {
                method: "POST",
                credentials: "include",
                headers:{
                    'Access-Control-Allow-Origin': "http://localhost:4000/",
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({username: this.state.username, password: this.state.password, email: this.state.email})
            })
            .then(resp => resp.json())
            .then(data => {
                this.props.navigate('/');
            })
            .catch(error => console.log(error));
        } 
        else {
            fetch('http://localhost:4000/login', {
                method: 'POST',
                credentials: "include",
                headers:{
                    'Content-type': "application/json"
                },
                body: JSON.stringify({username: this.state.username, password: this.state.password})
            })
            .then(resp => resp.json())
            .then(data => {
                if (data.status === 'PASS'){
                    setTimeout(() =>{
                        console.log(data);
                        window.sessionStorage.setItem('newNotif',data.payload.newNotificationReceived);
                        window.sessionStorage.setItem('pinCount',data.payload.pinCount);
                        window.sessionStorage.setItem('username',data.payload.username);
                        window.sessionStorage.setItem('defaultFolder',data.payload.defaultFolder);
                        window.sessionStorage.setItem('email',data.payload.email);
                        window.sessionStorage.setItem('folders', JSON.stringify(data.payload.folders));
                        window.sessionStorage.setItem('categories', JSON.stringify(data.payload.categories));
                        window.sessionStorage.setItem('notificationTurnedOn', data.payload.notificationTurnedOn);
                        window.sessionStorage.setItem('notificationFolder', data.payload.notificationFolder);
                        this.props.navigate('/');
                    }, 1000)
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.log(error));
        }
    }

    render(){
        return(
            <>
                <div id='loginOuterWrapper' style={this.state.properties}>
                    <div id='loginInnerWrapper'>
                        <div id="welcome-page-container">
                            {/*<img src="gridBackground.png" alt='Grid background' />*/}
                            <h1> Welcome Back! </h1>    
                            <p>We’re happy to see you again.</p>
                        </div>
                        <div id='loginContainer'>
                            <div id='login-container-wrapper'>
                                <div id='heading'>
                                    <h1> {this.state.heading} </h1>
                                </div>
                                <div id='input-fields'>
                                    <input onChange={(e) => this.updateState('username', e)} placeholder='Username'></input>
                                    <input onChange={(e) => this.updateState('password', e)} placeholder='Password' type='password'></input>
                                    <input style={this.state.confirmLoginField} onChange={(e) => this.updateState('confirmPassword',e)} placeholder='Confirm Password'></input>
                                    <input style={this.state.confirmLoginField} onChange={(e) => this.updateState('email',e)} placeholder='Email'></input>
                                </div>
                                <div id='additional-options'>
                                    <div id='keep-signedin' class='ao'>
                                        <div id='checkbox'></div>
                                        <p> Keep me signed in </p>
                                    </div>
                                    <div id='registrationlink'  class='ao'>
                                        <p onClick={(e) => this.changeOptions('register')}> {this.state.question} </p>
                                    </div>
                                </div>
                                <div id='buttons'>
                                    <button onClick={this.submit}>
                                        SUBMIT
                                    </button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

function RouterWrapper(props){
    let navigate = useNavigate();
    return <Login {...props} navigate={navigate} />
}

export default RouterWrapper;