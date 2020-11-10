import React, {useState} from 'react';
import {IonItem,
        IonIcon,
        IonLabel,IonToast,IonButton } from '@ionic/react';

import { logOutOutline } from 'ionicons/icons';
import {auth} from './../../firebase';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import classes from './Logout.module.css';



const loginStatusObject = {
    isLogged: false,
    userData: {},
    loggedMethod : '',
}

const Logout = (props) => {
    const [showToast, setShowToast] = useState("");
    const handleLogot = () => {
        auth.signOut();
        props.clearData();
        showToastHandle();
    } 
    const showToastHandle = () => {
        setShowToast(true);

        setTimeout( ()=>{
            setShowToast(false);
            props.handleUserStatus();
            
        }, 2500);
       
        
    }
    if (!props.isLogged) {
        return '';
    }

    return (
        <>
            <IonItem lines="none">
                <IonButton 
                        size="default" 
                        padding 
                        color="danger" 
                        onClick={handleLogot} 
                        expand="block" 
                        fill="solid"
                    > 
                    <IonIcon icon={logOutOutline} slot="start" /> <span>Wyloguj się</span>
                </IonButton>
            </IonItem>
            <IonToast color="danger" isOpen={showToast} message="Zostałeś wylogowany!"/>
        </>

        
    )
}



const mapStateToProps = state => {
    return {
        isLogged: state.user.isLogged
    };
}

// rzutowanie funkcji do odpowiedniego dispatcha
const mapDispatchToProps  = dispatch => {
    return {
        handleUserStatus : () => dispatch({type:actionTypes.USER_STATUS, value: loginStatusObject}),
        clearData : () => dispatch({type:actionTypes.CLEAR_DATA, value: true})
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);