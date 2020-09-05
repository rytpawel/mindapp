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
    IonMenuButton,
    IonActionSheet
} from '@ionic/react';

import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';

import classes from './Profile.module.css';
import {storage} from '../../firebase'; 
import Logout from '../LoginPage/Logout';

import { close, image, settings, text} from 'ionicons/icons';
import sygnet from '../../sygnet.png';

const Profile = (props) => {
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [avatar, setAvatar ] = useState(sygnet);

    useEffect(()=>{
        if( props.isLogged  === undefined || ! props.isLogged ) {
            console.log("Redirect to Login");
            props.history.push('/login');
            console.log(props.userData);
        }
    }, [props.isLogged]);

    useEffect(()=>{
       if ( props.userData.user_image_url == undefined || props.userData.user_image_url.includes('googleusercontent') ) {
            setAvatar(sygnet);
       } else {
            setAvatar(props.userData.user_image_url);
       }
    }, [props.userData.user_image_url]);

    
    const handleChangeName = () => {
        console.log("handleChangeName");
    }
    const handleChangeAvatar = () => {
        console.log("handleChangeAvatar");
    }
    
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
            <div className={classes.ProfileContainer}>
                <IonItemGroup>
                    <div className={classes.Avatar}>
                        <img src={avatar} />
                    </div>
                    <div className={classes.UserName}>
                        <span>{props.userData.user_name}<br/><small>{props.userData.user_email}</small></span>
                    </div>
                </IonItemGroup>
                <IonItem lines="none" hidden="true" >
                    <IonButton 
                            
                            size="default" 
                            padding 
                            color="primary" 
                            onClick={() => {setShowActionSheet(true)}} 
                            expand="block" 
                            fill="solid"
                        > 
                        <IonIcon icon={settings} slot="start" /> <span>Opcje</span>
                    </IonButton>
                </IonItem>

                <Logout/>

            </div>
            </IonContent>
            <IonActionSheet
                    isOpen={showActionSheet}
                    onDidDismiss={() => setShowActionSheet(false)}
                    buttons={[
                        { text: 'Zmień nazwę użytkownia',
                            icon: text,
                            handler: () => { handleChangeName(); }
                        },{ text: 'Zmień zdjęcie profilowe',
                            icon: image,
                            handler: () => { handleChangeAvatar(); }
                        },
                        { text: 'Anuluj',
                            icon: close,
                            role: 'cancel',
                            handler: () => { setShowActionSheet(false)}
                        }]}
                >
                </IonActionSheet>

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
            handleUserAvatar : () => dispatch({type:actionTypes.USER_AVATAR, value: ''})
        }
    
    }
export default connect(mapStateToProps, mapDispatchToProps)(Profile);