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
    IonIcon,IonHeader,
    IonButtons,
    IonMenuButton,
    IonListHeader
} from '@ionic/react';


import React, { useState, useEffect } from 'react';

import {auth} from './../../firebase';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';


import { firebase, firestore,storage  } from './../../firebase';

import {cfaSignIn} from 'capacitor-firebase-auth';
import { Redirect } from 'react-router';

import classes from './LoginModule.module.css';

import logoTyp from '../../logo-logotyp.png';
import sygnet from '../../sygnet.png';


const loginStatusObject = {
    isLogged: false,
    userData: {},
    loggedMethod : '',
}
let imageSrc = '';
const RegisterPage = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [error_message, setErrorMessage] = useState("");
    const [showToast, setShowToast] = useState("");
    const [showLoading, setShowLoading] = useState(false);

    const handleCreateAccount = async () => {
        setShowLoading(true);
        try {
            const credential  = await auth.createUserWithEmailAndPassword(email, password);
            loginStatusObject.isLogged = true;
            loginStatusObject.userData = {user_email:email, user_name:email, user_image_url:sygnet, user_uid: email};
            loginStatusObject.loggedMethod = 'signInWithEmailAndPassword';
            console.log("Success", credential);
            props.handleUserStatus();
            
            setShowToast(true);
    
            setTimeout( ()=>{
                setShowToast(false);
                console.log("Redirect to my projects");
                props.history.push('/my-projects');
            }, 2500);
            setShowLoading(false);
           
           

            //props.handleUserStatus();

        } catch (e) {
            
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                    </IonButtons>
                    <IonTitle>
                        Utwórz konto
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className={classes.LoginContainer} fullscreen={true}>
                <img className={classes.Logo} src={logoTyp}/>
                <IonItemGroup>
                    
                    <IonList inset={true}>
                        <IonItem lines="full">
                            <IonLabel color="primary" position="floating">Twój adres E-mail</IonLabel>
                            <IonInput className={classes.CustomInput} 
                                        autocomplete="email"  
                                        autocomplete={true} 
                                        inputmode="email" 
                                        type="email" 
                                        placeholder='email@example.com' 
                                        required={true} 
                                        value={email} 
                                        onIonChange={(event) => { setEmail(event.detail.value); }}
                            />
                        </IonItem>
                        <IonItem lines="full">
                            <IonLabel color="primary" position="floating">Twoje hasło</IonLabel>
                            <IonInput className={classes.CustomInput} 
                                        type="password" 
                                        placeholder='password' 
                                        onIonChange={(event) => { setPassword(event.detail.value);  }}
                            />
                        </IonItem>
                        <IonButton className={classes.CustomButtom} color="primary" size="default"  onClick={handleCreateAccount}>Utwórz konto</IonButton>
                        <IonButton className={classes.CustomButtom2} color="primary" size="default" fill="clear" onClick={() => props.history.push('/login') }>Masz już konto? Zaloguj się!</IonButton>
                    </IonList>
                </IonItemGroup>                
                <IonToast color="success" isOpen={showToast} message="Konto zostało pomyślnie utworzone, jesteś zalogowany!"/>
                <IonToast color="danger" isOpen={error} message={error_message}/>
                <IonLoading
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    message={'Trwa autoryzacja..'}
                    duration={5000}
                />
            </IonContent>
        </IonPage>
    )
}

// Rzutowanie globalnego state do props
const mapStateToProps = state => {
    return {
        isLogged: state.user.isLogged
    };
}

// rzutowanie funkcji do odpowiedniego dispatcha
const mapDispatchToProps  = dispatch => {
    return {
        handleUserStatus : () => dispatch({type:actionTypes.USER_STATUS, value: loginStatusObject})
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);

