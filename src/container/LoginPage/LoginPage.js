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
    IonToast,
    IonLoading,
    IonItemDivider,
    IonItemGroup,
    IonIcon,IonHeader,
    IonButtons,
    IonMenuButton
} from '@ionic/react';
import { logoGoogle, logoFacebook } from 'ionicons/icons';

import React, { useState, useEffect } from 'react';

import {auth} from './../../firebase';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';


import { firebase, firestore, storage  } from './../../firebase';

import {cfaSignIn} from 'capacitor-firebase-auth';


import classes from './LoginModule.module.css';

import logoTyp from '../../logo-logotyp.png';
import sygnet from '../../sygnet.png';


const loginStatusObject = {
    isLogged: false,
    userData: {},
    loggedMethod : '',
}
let imageSrc = '';
const LoginPage = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [error_message, setErrorMessage] = useState("");
    const [showToast, setShowToast] = useState("");
    const [showLoading, setShowLoading] = useState(false);

    const showSuccessToast = () => {
        setShowToast(true);

        setTimeout( ()=>{
            setShowToast(false);
            console.log("Redirect to my projects");
            props.history.push('/my-projects');
        }, 2500);
        setShowLoading(false);
    }

    const showErrorMessage = (error) => {
        if(error.code === "auth/wrong-password"){
            setErrorMessage("Twój login lub hasło jest niepoprawne. Sprawdź podane dane i spróbuj ponownie.");
        } else {
            setErrorMessage(error.message);
        }
        setShowLoading(false);
        setError(true);

        setTimeout( ()=>{
            setError(false);
        }, 3000);
    }

    const handleLoginGoogle = () => {
        try {
            cfaSignIn('google.com').subscribe(
                (user) => {
                    user.providerData.forEach(function (profile) {
						loginStatusObject.userData = { 
							user_uid : profile.uid,
							user_email: profile.email, 
							user_name: profile.displayName, 
							user_image_url: profile.photoURL
						};
						loginStatusObject.loggedMethod = profile.providerId;
                    });
                    loginStatusObject.isLogged = true;

                    handleCreateAccount();
                    showSuccessToast();
                }
            )
        } catch (e) {
            showErrorMessage(e);
        }
    }

    const handleLoginFacebook = () => {
        try {
            cfaSignIn('facebook.com').subscribe(
                (user) => {
                    user.providerData.forEach(function (profile) {
						console.log("Sign-in provider: " + profile.providerId);
						console.log("  Name: " + profile.displayName);
						console.log("  Email: " + profile.email);
						console.log("  Photo URL: " + profile.photoURL);
						loginStatusObject.userData = { 
							user_uid : profile.uid,
							user_email:profile.email, 
							user_name:profile.displayName, 
							user_image_url:profile.photoURL
						};
						loginStatusObject.loggedMethod = profile.providerId;
                    });
                    loginStatusObject.isLogged = true;
                    showSuccessToast();
                    handleCreateAccount();
                    
                }
            )
        } catch (e) {
            showErrorMessage(e);
        }

    }
    const handleLogin = async () => {
        setShowLoading(true);
        try {
            const credential  = await auth.signInWithEmailAndPassword(email, password);
            loginStatusObject.isLogged = true;
            loginStatusObject.userData = {user_email:email, user_name:email, user_image_url:null, user_uid: email};
            loginStatusObject.loggedMethod = 'signInWithEmailAndPassword';
            console.log("Success", credential);
            //showSuccessToast();
            
            handleCreateAccount();

            //props.handleUserStatus();

        } catch (e) {
            showErrorMessage(e);
        }
    }
    const checkIfPicutreExist  = async () => {
        try {
            const image = await storage.ref(`/users/${loginStatusObject.userData.user_uid}/account/logo.png`).getDownloadURL();
            return true;
        }
        catch (e) {
            return false;
        }     
    }

    const handleCreateAccount = async () => {

        if( loginStatusObject.isLogged ) {
            if( loginStatusObject.userData.user_image_url == undefined || loginStatusObject.userData.user_image_url == null || loginStatusObject.userData.user_image_url == '') {
                loginStatusObject.userData.user_image_url = sygnet;
                const save = savePicture(loginStatusObject.userData.user_image_url);
                save.then((e) => {
                    console.log("ZAPISALEM?");
                    
                })
            } 
            if( loginStatusObject.userData.user_image_url != undefined && loginStatusObject.userData.user_image_url != null && loginStatusObject.userData.user_image_url != '') {
                if ( loginStatusObject.userData.user_image_url.includes('googleusercontent') ) {
                    loginStatusObject.userData.user_image_url = sygnet;
                    const save = savePicture(loginStatusObject.userData.user_image_url);
                    save.then((e) => {
                        console.log("ZAPISALEM?");
                        
                    })
                }
            }
        }
    }

   
    const redirectIfLogged = () => {
        if ( props.isLogged ) {
            console.log("Redirect to my projects");
            props.history.push('/my-projects');
        }
    }

    const savePicture = async (blobURL) => {
        console.log(blobURL);
        if ( loginStatusObject.userData.user_uid !== undefined && loginStatusObject.userData.user_uid !== null ) {
            console.log(blobURL);
            
            const pictureRef = storage.ref(`/users/${loginStatusObject.userData.user_uid}/account/${Date.now()}`);
                
            const response = await fetch(blobURL, { mode: 'no-cors' });
            const blob = await response.blob();
            const snapshot = await pictureRef.put(blob);
            const url = await snapshot.ref.getDownloadURL();
            //imageSrc = url;
            loginStatusObject.userData.user_image_url = url;
            console.log(url);

            var user = auth.currentUser;
          
             
            user.updateProfile({
                photoURL: url
            }).then(function() {
                console.log("DONE");
            }).catch(function(error) {
                console.log(error);
            });
            props.handleUserStatus();

        }
        
    }
    redirectIfLogged();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                    </IonButtons>
                    <IonTitle>
                        Zaloguj się
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className={classes.LoginContainer} fullscreen={true}>
                <img className={classes.Logo} src={logoTyp}/>
                <IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>
                            <span className={classes.BigTitle}>Sign in with your social account</span> 
                        </IonLabel>
                    </IonItemDivider>
                    <IonList>
                        <IonItem lines="none">
                            <IonButton 
                                    className={classes.GoogleButton} 
                                    size="default" 
                                    padding 
                                    color="danger" 
                                    onClick={() => handleLoginGoogle()} 
                                    expand="block" 
                                    fill="solid"
                                > 
                                <IonIcon icon={logoGoogle} slot="start" /> <span>Sign in with Google</span>
                            </IonButton>
                        </IonItem>
                        <IonItem lines="none">
                            <IonButton 
                                    className={classes.GoogleButton} 
                                    size="default" 
                                    padding 
                                    color="primary" 
                                    onClick={() =>handleLoginFacebook()} 
                                    expand="block" 
                                    fill="solid"
                                > 
                                <IonIcon icon={logoFacebook} slot="start" /> <span>Sign in with Facebook</span>
                            </IonButton>
                        </IonItem>
                    </IonList>
                    <IonItemDivider>
                        <IonLabel>
                            <span className={classes.BigTitle}>Or sign in with your existing account</span>
                        </IonLabel>
                    </IonItemDivider>
                    <IonList inset={true}>
                        <IonItem lines="full">
                            <IonLabel color="primary" position="floating">Twój E-mail</IonLabel>
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
                            <IonLabel color="primary" position="floating">Hasło</IonLabel>
                            <IonInput className={classes.CustomInput} 
                                        type="password" 
                                        placeholder='password' 
                                        onIonChange={(event) => { setPassword(event.detail.value);  }}
                            />
                        </IonItem>
                        <IonButton className={classes.CustomButtom} color="primary" size="default"  onClick={() =>handleLogin()}>Zaloguj się</IonButton>
                        <IonButton className={classes.CustomButtom2} color="primary" size="default" fill="clear" onClick={() => props.history.push('/register') }>Nie posiadasz konta? Zarejestruj się!</IonButton>
                    </IonList>
                </IonItemGroup>                
                <IonToast color="success" isOpen={showToast} message="Jesteś zalogowany, złotko!"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

