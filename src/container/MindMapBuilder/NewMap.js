import React, { Component, useState, useEffect } from 'react';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
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
    IonAvatar,IonHeader,IonButtons,IonMenuButton,IonModal,IonTextarea,IonCard,IonCardContent,IonCardHeader

} from '@ionic/react';
//Library
import {Route, Switch} from 'react-router-dom';
import classes from './NewMap.module.css';
import { firestore } from './../../firebase';
let mapToEdit = '';

const NewMap = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const {userID } = '372tN0OpPLWbLUaRalCoAGHlob33';
    const [showToast, setShowToast] = useState(false);

    const handleSaveMap = async () => {
        let new_map = {
            name: name,
            description: desc,
            map: {}
        }
        if( props.isLogged ) {
            const entriesRef = firestore.collection('users')
                .doc(props.userData.user_uid)
                .collection('maps');
            const entryref = await entriesRef.add(new_map).then((e)=>{
                console.log(e.id);
                mapToEdit = e.id;
                
                props.handleMapToEdit();
                props.history.push('/');
            });
            
            setShowModal(false); 
        } else {
            setShowModal(false); 
            showToastHandle();
        }
    }    
    const showToastHandle = () => {
        setShowToast(true);
        setTimeout( ()=>{
            setShowToast(false);
            props.handleUserStatus();
        }, 2500);
        
    }
    return (
        <div className="content">
            <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
                <IonContent className="newmap" fullscreen={true}>
                    <div className={classes.Content}>
                        <h3>Nie utworzyłeś/aś jeszcze żadnego projektu ;(</h3>
                        <p>...</p>
                        <IonButton size="small"  color="primary" onClick={() => setShowModal(true)}>UTWÓRZ PROJEKT</IonButton>
                    </div>

                    <IonModal 
                            isOpen={showModal} 
                            cssClass={classes.CustomModal}
                            swipeToClose={true}
                            animated={true}
                            onDidDismiss={() => setShowModal(false)}
                        >
                        <IonPage>
                            <IonContent>
                                <IonToolbar>
                                    <IonTitle>
                                        Nowy Projekt
                                    </IonTitle>
                                    <IonButtons slot="end">
                                        <IonButton className={classes.BtnClose}  onClick={() => handleSaveMap()}>ZAPISZ</IonButton>
                                    </IonButtons>
                                </IonToolbar>
                                <IonCard>
                                    <img src="https://placehold.it/600x300"/>
                                    <IonCardContent>
                                        <IonItem>
                                            <IonLabel color="dark" position="floating">Nazwa</IonLabel>
                                                <IonInput className={classes.CustomInput} autocomplete="text"  autocomplete={true} inputmode="text" type="text" placeholder='Moja pierwsza mapa myśli' value={name} required={true}  
                                                    onIonChange={(event) => { setName(event.detail.value); }}
                                                />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel color="dark" position="floating">Opis</IonLabel>
                                            <IonTextarea placeholder='Krótki opis (opcjonalnie)'
                                                value={desc} required={false} onIonChange={e => setDesc(e.detail.value)}>
                                            </IonTextarea>
                                        </IonItem>
                                    </IonCardContent>
                                </IonCard>
                                
                            </IonContent>
                        </IonPage>
                    </IonModal>
                </IonContent>
            </IonPage>
            <IonToast color="danger" isOpen={showToast} message="Nie jesteś zalogowany!"/>
        </div>
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
            handleUserStatus : () => dispatch({type:actionTypes.USER_STATUS, value: {}}),
            handleMapToEdit : () => dispatch({type:actionTypes.SELECT_MAP_TO_EDIT, value: mapToEdit})
        }
    
    }
export default connect(mapStateToProps, mapDispatchToProps)(NewMap);