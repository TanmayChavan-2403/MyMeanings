import '../stylesheets/login.css'
import { useNavigate } from 'react-router-dom';
const { Component } = require("react");


class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmPassword:'',
            register: false,
            heading: 'LOGIN',
            properties: {
                display: 'flex',
                pointerEvents:'all'
            }
        }
        this.submit = this.submit.bind(this);
    }

    updateState(field, event){
        this.setState({
            [field]: event.target.value
        })
    }

    register(){
        this.setState({
            heading: 'LOGIN',
            register: true
        })
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
        } else if (this.state.password != this.state.confirmPassword){
            alert("Confirm Password does not match with password");
            return;
        }
        if (this.state.register){
            fetch('http://localhost:4000/register', {
                method: "POST",
                headers:{
                    'Access-Control-Allow-Origin': "http://localhost:4000/",
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({username: this.state.username, password: this.state.password})
            })
            .then(resp => resp.json())
            .then(data => {
                console.log(data.access_token);
                this.closeContainer();
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
                                
                        </div>
                        <div id='loginContainer'>
                            <div id='heading'>
                                <h1> {this.state.heading} </h1>
                            </div>
                            <div id='input-fields'>
                                <input onChange={(e) => this.updateState('username', e)} placeholder='Username'></input>
                                <input onChange={(e) => this.updateState('password', e)} placeholder='Password'></input>
                                <input onChange={(e) => this.updateState('confirmPassword',e)} placeholder='Confirm Password'></input>
                            </div>
                            <div id='additional-options'>
                                <div id='keep-signedin' class='ao'>
                                    <div id='checkbox'></div>
                                    <p> Keep me signed in </p>
                                </div>
                                <div id='registrationlink'  class='ao'>
                                    <p>Already a member ?</p>
                                </div>
                            </div>
                            <div id='buttons'>
                                <button onClick={this.submit}>
                                    SUBMIT
                                </button>
                                {/*<p onClick={(e) => this.register('register')}>Not registered? then click here to register</p>*/}
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