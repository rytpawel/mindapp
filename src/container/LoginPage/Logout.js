import React, {useState} from 'react';
import {IonItem,
        IonIcon,
        IonLabel,IonToast } from '@ionic/react';

import { logOutOutline } from 'ionicons/icons';
import {auth} from './../../firebase';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';



const loginStatusObject = {
    isLogged: false,
    userData: {},
    loggedMethod : '',
}

const Logout = (props) => {
    const [showToast, setShowToast] = useState("");
    const handleLogot = () => {
        auth.signOut();
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
            <IonItem lines="none"onClick={handleLogot} > 
                <IonIcon icon={logOutOutline} slot="start" />
                <IonLabel>
                    <h2>Wyloguj się</h2>
                </IonLabel>
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
        handleUserStatus : () => dispatch({type:actionTypes.USER_STATUS, value: loginStatusObject})
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);