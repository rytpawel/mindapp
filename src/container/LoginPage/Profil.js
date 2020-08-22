import React, { Component, useState, useEffect } from 'react';
//Library
import {Route, Switch} from 'react-router-dom';
import {
    IonContent,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonText,
    IonToast,
    IonLoading,
    IonItemDivider,
    IonItemGroup,
    IonIcon,
    IonAvatar,
    IonHeader,
    IonButtons,
    IonMenuButton
} from '@ionic/react';

import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import {request} from '../AllProjectsPage/UserData';
import classes from './Profile.module.css';

const Profile = (props) => {
    const [imageSrc, setimageSrc] = useState('');
    const getImage = () => {
        if(props.isLogged && props.userData.user_image_url) {
            const temp = request(props.userData.user_image_url);
            temp.then((e)=>{         
                if (e.url !== undefined && e.url !=""){
                    setimageSrc( e.url);
                    console.log(e.url);
                } else {
                    setimageSrc('https://ionicframework.com/docs/demos/api/avatar/avatar.svg');
                }
                    
            })
        }
        
    }
    getImage();
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                    </IonButtons>
                    <IonTitle>
                        Mój profil
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen={false}>
            <IonItemGroup>
                <div className={classes.Avatar}>
                    <img src={imageSrc} />
                </div>
                <div className={classes.UserName}>
                    <span>{props.userData.user_name}<br/><small>{props.userData.user_email}</small></span>
                </div>
                </IonItemGroup>
            </IonContent>
        </IonPage>
    );
}
    
    // Rzutowanie globalnego state do props
    const mapStateToProps = state => {
        return {
            isLogged: state.user.isLogged,
            userData: state.user.userData
        };
    }
    
    // rzutowanie funkcji do odpowiedniego dispatcha
    const mapDispatchToProps  = dispatch => {
        return {
            handleUserStatus : () => dispatch({type:actionTypes.USER_STATUS, value: {}})
        }
    
    }
export default connect(mapStateToProps, mapDispatchToProps)(Profile);