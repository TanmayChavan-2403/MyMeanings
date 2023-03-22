import React, { Component } from 'react';
// import styles from '../stylesheets/profile.module.css';

import '../stylesheets/profile.css'

class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeContainer: 'account',
            activeStyle: {backgroundColor: 'var(--grey)'},
            deactiveStyle: {backgroundColor: 'transparent'},
            cnfContainer: false,
            confirmContanier: false
        }
        this.showCnfContainer = this.showCnfContainer.bind(this);
        this.toggleConfirmationWindow = this.toggleConfirmationWindow.bind(this);
    }

    changeTab(name){
        this.setState({
            activeContainer: name
        })
    }

    showCnfContainer(){
        this.setState({
            cnfContainer: !this.state.cnfContainer
        })
    }

    toggleConfirmationWindow(){
        this.setState({
            confirmContanier: !this.state.confirmContanier
        })
    }
    
    render(){
        return(
            <div id='profileOuterWrapper'>
                <div id='profileInnerWrapper'>

                    <div id='profile_banner'>
                        <div id='username'>
                            <h1> {window.sessionStorage.getItem('username')} </h1>
                        </div>
                    </div>

                    <eiv id='profileContainer'>
                        <div id='avatar_container_wrapper'>
                            <div id='avatar_container'>
                                <div id='avatar'>
                                    <img id='avatar_image' src='./avatar.png' alt='Avatar'></img>
                                </div>
                            </div>
                            <div id='tabs-container'>
                                <div id='tabs'>
                                    <div class='tab' onClick={() => this.changeTab('account')} style={this.state.activeContainer === 'account' ? this.state.activeStyle : this.state.deactiveStyle}>
                                        <h4> Account </h4>
                                    </div>
                                    <div class='tab' onClick={() => this.changeTab('friends')} style={this.state.activeContainer === 'friends' ? this.state.activeStyle : this.state.deactiveStyle}>
                                        <h4> Friends </h4>
                                    </div>
                                    <div class='tab' onClick={() => this.changeTab('folders')} style={this.state.activeContainer === 'folders' ? this.state.activeStyle : this.state.deactiveStyle}>
                                        <h4> Folders </h4>
                                    </div>
                                    <div class='tab' onClick={() => this.changeTab('statistics')} style={this.state.activeContainer === 'statistics' ? this.state.activeStyle : this.state.deactiveStyle}>
                                        <h4> Statistics </h4>
                                    </div>
                                </div>
                            </div>
                            <div id='closeButton'>
                                <i onClick={() => window.history.back()} id='closeButtonIcon' class="fa-solid fa-circle-xmark"></i>
                            </div>
                        </div>

                        <div id='content'>
                            {
                                this.state.activeContainer === 'friends' ? <Friends /> :
                                this.state.activeContainer === 'folders' ? <Folders /> : 
                                this.state.activeContainer === 'statistics' ? <Statistics /> :
                                <Account 
                                    status={this.state.cnfContainer}
                                    updateStatus={this.showCnfContainer}
                                    confirmContanier={this.state.confirmContanier}
                                    toggleCnfWindow={this.toggleConfirmationWindow}
                                />
                            }                          
                        </div>

                    </eiv>
                </div>
            </div>
        )
    }
}


function Account(props){

    const logout = () => {
        fetch('http://localhost:4000/logout', {
            credentials: "include"
        })
        .then(rec => {window.location.reload()})
        .catch(err => console.log(err));
    }

    return(
        <>
            <div id='account-container' class='sb'>
                {
                    props.status ? 
                        <div id='password-container'>
                            <input type='password' placeholder='Enter your password' />
                            <button> SUBMIT </button>
                            <div id='conf-close-button'>
                                <i onClick={() => props.updateStatus()}  class="fa-solid fa-circle-xmark"></i>
                            </div>
                        </div>
                    : null
                }
                <div class='field'>
                    <div class='key'>
                        <p> <strong>Username</strong> </p>
                    </div>
                    <div class='value'>
                        <p> {window.sessionStorage.getItem('username')} </p>
                    </div>
                </div>
                <div class='field'>
                    <div class='key'><strong>Password</strong></div>
                    <div class='value'> 
                        <button  onClick={() => props.updateStatus()} id='password'> <i class="fa-solid fa-lock"></i> Request password visibility </button>
                    </div>
                </div>
                <div class='field'>
                    <div class='key'><strong>Email</strong></div>
                    <div class='value'>{window.sessionStorage.getItem('email')}</div>
                </div>
                <div class='field'>
                    <div class='key'><strong>Default Folder</strong></div>
                    <div class='value'>{window.sessionStorage.getItem('defaultFolder')}</div>
                </div>
                <div class='Spfield'>
                    <button onClick={props.toggleCnfWindow} id='deleteAcc'> <i class="fa-solid fa-trash"></i> Delete Account </button>
                    <button onClick={logout} id='logout'> <i class="fa-solid fa-right-from-bracket"></i> Log out </button>
                </div>
            </div>
            {
                props.confirmContanier ? 
                    <div id='confirmContanier-container'>
                        <div id='confirmContanier'>
                            <div id='cw-heading'>
                                <p> Confirmation Window </p>
                                <i onClick={props.toggleCnfWindow} class="fa-solid fa-circle-xmark cw-xmark"></i>
                            </div> 
                            <div id='cw-info'>
                                <p>
                                    <strong> <h3>⚠ READ THIS CAREFULLY!!</h3> </strong>
                                    <br />
                                    Please not that performing this action will permanentaly delete all your data which includes your account, folders, friends
                                    and its irreversible process. Please think before proceeding further and if you still want to delete then please click on confirm button below.
                                    <br />
                                    <br />
                                    <strong> Thank you for using our service 😊 </strong>
                                </p>
                            </div>
                            <div id='cw-button'>
                                <button id='delete-account'> CONFIRM  </button>
                            </div>
                        </div>
                    </div>
                : null
            }
        </>
    )
}


function Friends(){
    return(
        <div id='friends-container' class='sb'>
            <div class='new-feature'>
                <h2> WE ARE WORKING HARD TO ADD THIS FEATURE </h2>
            </div>
            <div class='new-feature nf2'>
                <h2> YOU WILL BE UPDATED SOON WHEN ITS LIVE </h2>
            </div>
            <div id='working-img-container'>
                <img src='./working.png' alt='Working Hard'/>
            </div>
        </div>
    )
}

function Folders(){
    return(
        <div id='folders-container' class='sb'>
            <div class='new-feature'>
                <h2> WE ARE WORKING HARD TO ADD THIS FEATURE </h2>
            </div>
            <div class='new-feature nf2'>
                <h2> YOU WILL BE UPDATED SOON WHEN ITS LIVE </h2>
            </div>
            <div id='working-img-container'>
                <img src='./working.png' alt='Working Hard'/>
            </div>
        </div>
    )
}

function Statistics(){
    return(
        <div id='statistics-container' class='sb'>
            <div class='new-feature'>
                <h2> WE ARE WORKING HARD TO ADD THIS FEATURE </h2>
            </div>
            <div class='new-feature nf2'>
                <h2> YOU WILL BE UPDATED SOON WHEN ITS LIVE </h2>
            </div>
            <div id='working-img-container'>
                <img src='./working.png' alt='Working Hard'/>
            </div>
        </div>
    )
}

export default Profile;