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
    IonAvatar,IonHeader,IonButtons,IonMenuButton,IonModal,IonTextarea,IonCard,IonCardContent,IonCardHeader,IonItemSliding,IonItemOptions,IonItemOption, IonListHeader,
    IonActionSheet,
    IonAlert
    

} from '@ionic/react';

import { trash, share,heart,play , close, text} from 'ionicons/icons';
//Library
import {Route, Switch} from 'react-router-dom';

import { firestore } from './../../firebase';
let mapToEdit = '';
let selectedMapID = '';

const MyProjects = (props) => {
    let [allMyMaps, updateAllMyMaps] = useState();
    let [isDeleted, setIsDeleted] = useState(false);
    let [showActionSheet, setShowActionSheet] = useState(false);
    let [showDeletedAlert, setShowDeletedAlert] = useState(false);
    

    let deleteMap = (id) => {
        const deleteItemId = id;
        const entriesRef =  firestore.collection("users").doc(props.userData.user_uid).collection("maps");
        let usuwanko =  entriesRef.doc(deleteItemId).delete().then(()=>{
    });
        
        
    }

    const handleClick = (map_id) => {
        selectedMapID = map_id;
        setShowActionSheet(true);
    }
    const handleOpen = () => {
        mapToEdit = selectedMapID;
        setShowActionSheet(false)
        props.handleMapToEdit();
        props.history.push('/');
    }
    const handleDelete = () => {
        setShowActionSheet(false);
        setShowDeletedAlert(false);
        deleteMap(selectedMapID);
    }
    const handleEditName = () => {
        console.log("Edit name not working yet");
    }

    let list_of_maps = <IonItem>
                            <IonLabel>
                                0 projektów
                            </IonLabel>
                        </IonItem>;
    if(props.allMaps!==undefined && props.allMaps !== null && props.allMaps !== {}) {
        
        list_of_maps = Object.entries(props.allMaps).map((key, i) => {
            return (
                <IonItemSliding key={i}>
                    <IonItem onClick={() => {handleClick(key[0])}}>
                        <IonAvatar slot="start">
                            <img src="https://placehold.it/50x50"/>
                        </IonAvatar>
                        <IonLabel>
                            <h2>{key[1].name ? key[1].name : 'Untitled'}</h2>
                            <p>{key[1].description ? key[1].description : ''}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItemOptions side="end">
                        <IonItemOption color="medium" onClick={() => {deleteMap(key[0])}}><IonIcon icon={trash}/></IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            );
          });
    } else {
        list_of_maps = <IonItem>
                            <IonLabel>
                                0 projektów
                            </IonLabel>
                        </IonItem>;
    }
   
   
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                    </IonButtons>
                    <IonTitle>
                        Moje projekty
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen={true}>
                <IonList>
                    <IonListHeader>
                        Lista moich projektów
                    </IonListHeader>
                    {list_of_maps}
                    
                </IonList>
                <IonActionSheet
                    isOpen={showActionSheet}
                    onDidDismiss={() => setShowActionSheet(false)}
                    buttons={[
                        { text: 'Otwórz',
                            icon: play,
                            handler: () => { handleOpen(); }
                        },{ text: 'Edytuj nazwę',
                            icon: text,
                            handler: () => { handleEditName(); }
                        },
                        {   text: 'Usuń',
                            role: 'destructive',
                            icon: trash,
                            handler: () => { setShowDeletedAlert(true); }      
                        },
                        { text: 'Anuluj',
                            icon: close,
                            role: 'cancel',
                            handler: () => { setShowActionSheet(false)}
                        }]}
                >
                </IonActionSheet>
                <IonAlert
                    isOpen={showDeletedAlert}
                    onDidDismiss={() => setShowDeletedAlert(false)}
                    cssClass='my-custom-class'
                    header={'Jesteś pewien?'}
                    message={'Na pewno chcesz usunąć ten element?'}
                    buttons= {[
                            {   text: 'Nie, nie chcę',
                                role: 'cancel',
                                cssClass: 'secondary'
                            },{ text: 'Tak, usuń',
                                handler: () => {handleDelete()}
                            }]}
                />
            </IonContent>
        </IonPage>
    );

}


// Rzutowanie globalnego state do props
const mapStateToProps = state => {
    return {
        isLogged: state.user.isLogged,
        userData: state.user.userData,
        currentMapId : state.maps.currentmapid,
		allMaps : state.maps.mindmaps
    };
}

// rzutowanie funkcji do odpowiedniego dispatcha
const mapDispatchToProps  = dispatch => {
    return {
        
        handleMapToEdit : () => dispatch({type:actionTypes.SELECT_MAP_TO_EDIT, value: mapToEdit})
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(MyProjects);