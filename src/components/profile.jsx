import React, { Component } from 'react';
// import styles from '../stylesheets/profile.module.css';

import '../stylesheets/profile.css'

class Profile extends Component{
    
    render(){
        return(
            <div id='profileOuterWrapper'>
                <div id='profileInnerWrapper'>
                    <div id='profile_banner'>
                        <div id='username'>
                            <h1> Hackytech </h1>
                        </div>
                    </div>
                    <eiv id='profileContainer'>

                        <div id='avatar_container_wrapper'>
                            <div id='avatar_container'>
                                <div id='avatar'>
                                    <img id='avatar_image' src='./avatar.png'></img>
                                </div>
                            </div>
                            <div id='closeButton'>
                                <i id='closeButtonIcon' class="fa-solid fa-circle-xmark"></i>
                            </div>
                        </div>

                        <div id='content'>
                            
                        </div>

                    </eiv>
                </div>
            </div>
        )
    }
}

export default Profile;