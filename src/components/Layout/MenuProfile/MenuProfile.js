import React, {Component} from 'react';

import classes from './MenuProfile.module.css';


const MenuProfile = (props) => {
    if ( props.user ) {
        return (
            <div id="GoogleWidget" onClick={props.action} className={classes.MenuProfile}>
                <span>{props.user.name}</span>
                <img src={props.user.profileImg} alt="user profile" />
            </div>
        );
    } else {
        
        return (
            <div id="GoogleWidget" className={classes.MenuProfile}>
                <span>Zaloguj się</span>
            </div>
        );

    }

}

export default MenuProfile;