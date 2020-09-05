import React, {  useState, useRef, useEffect } from 'react';

import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';

import {
    IonContent,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonItem,
    IonInput,
    IonLabel,
    IonLoading,
    IonIcon,
    IonButtons,
    IonModal,
    IonTextarea,
    IonCard,
    IonCardContent,
    IonFab,
    IonFabButton,
    isPlatform
} from '@ionic/react';
import { add } from 'ionicons/icons';
//Library

import classes from './NewMap.module.css';
import { firestore, storage } from './../../firebase';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core'
import placeholderImage from '../../placeholder.jpg';


const { Camera } = Plugins

let mapToEdit = '';


const EditMap = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    
    const [hasImage, setHasImage] = useState(false);
    const [pictureUrl, setPictureUrl] = useState("");

    const [showLoading, setShowLoading] = useState(false);
    const fileInputRef = useRef();
    const [loadedData, setLoadedData] = useState(false);
    const [forceReload, setForceReload] = useState(false);



    useEffect(()=> {
        return () => {
            console.log("USE STATE?", props.map_data);
            console.log(loadedData);
            console.log(forceReload);
            if ( props.map_data !== undefined && props.map_data.name != name && forceReload) {
                setLoadedData(false);
                setForceReload(false);
            }
            if( !loadedData && props.map_data !== undefined ) {
                setName(props.map_data.name);
                setDesc(props.map_data.description);
                setPictureUrl(props.map_data.image);
                if(props.map_data.image != '') {
                    setHasImage(true);
                } else {
                    setHasImage(false);
                }
                setLoadedData(true);
            }
        }
    });

    useEffect(()=>{
        return () => {
            if(pictureUrl.startsWith('blob:')) {
                URL.revokeObjectURL(pictureUrl);
            }
        } 
    }, [pictureUrl]);


    const handleUpdateMap = async () => {
    
        if( props.isLogged ) {
            const entriesRef = firestore.collection('users')
						.doc(props.userData.user_uid)
						.collection('maps').doc(props.map_data_id).update({
                            name:name,
                            description:desc,
                            image:pictureUrl 
                        });
            setLoadedData(false);
            setForceReload(true);
            props.finishEdit();
        } else {
            setShowModal(false); 
            setLoadedData(false);
            setForceReload(true);
        }
    }    
    const savePicture  = async (blobURL) => {
            
        if ( props.userData.user_uid !== undefined && props.userData.user_uid !== null ) {
            const pictureRef = storage.ref(`/users/${props.userData.user_uid}/pictures/${Date.now()}`);
            const response = await fetch(blobURL);
            const blob = await response.blob();
            const snapshot = await pictureRef.put(blob);
            const url = await snapshot.ref.getDownloadURL();

            setPictureUrl(url);
            setHasImage(true);
            setShowLoading(false);
             
            return url;
        }
        
    }
  
    const handleFileChange = (event) => {
            
        if ( event.target.files.length > 0) {
            setShowLoading(true);
            
            const file = event.target.files.item(0);
            const pictureUrlTmp = URL.createObjectURL(file);

            setPictureUrl(pictureUrlTmp);
            savePicture(pictureUrlTmp);
            
        }
    }
    const handleImageLoad = async () => {
            
        if ( isPlatform('capacitor')){
            try{
                setShowLoading(true);
                const photo = await Camera.getPhoto({
                    resultType : CameraResultType.Uri,
                    source: CameraSource.Prompt,
                    width: 800,
                });
                setPictureUrl(photo.webPath);
                savePicture(photo.webPath);
            } catch (error) {
                console.log(error);
                
            }
        } else {
            fileInputRef.current.click();
        }
    }

    return (        
               
                <>
                   
        
                    <IonModal 
                            isOpen={props.show} 
                            cssClass={classes.CustomModal}
                            swipeToClose={true}
                            animated={true}
                            onDidDismiss={() =>{setLoadedData(false);  setForceReload(true); props.finishEdit()}}
                        >
                        <IonPage>
                            <IonContent>
                                <IonToolbar>
                                    <IonTitle>
                                        Edytuj mapę
                                    </IonTitle>
                                    <IonButtons slot="end">
                                        <IonButton className={classes.BtnClose}  onClick={() => handleUpdateMap()}>Aktualizuj</IonButton>
                                    </IonButtons>
                                </IonToolbar>
                                <IonCard>
                                    
                                    <IonCardContent>
                                        <IonItem>
                                            <IonLabel color="dark" position="floating">Nazwa</IonLabel>
                                                <IonInput 
                                                    className={classes.CustomInput} 
                                                    autocomplete="text"
                                                    inputmode="text" 
                                                    type="text" 
                                                    placeholder='Moja pierwsza mapa myśli' 
                                                    value={name} 
                                                    required={true}  
                                                    onIonChange={(event) => { setName(event.detail.value); }}
                                                />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel color="dark" position="floating">Opis</IonLabel>
                                            <IonTextarea 
                                                placeholder='Krótki opis (opcjonalnie)'
                                                value={desc} 
                                                required={false} 
                                                onIonChange={e => setDesc(e.detail.value)}
                                            />
                                            
                                        </IonItem>
                                        <IonItem lines="none">
                                            <IonLabel color="dark">Obrazek <small>(kliknij w zdjęcie)</small></IonLabel>
                                        </IonItem>
                                        <IonItem lines="none">
                                            <input hidden type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef}/>
                                            <img src={hasImage ? pictureUrl : placeholderImage} alt="" onClick={handleImageLoad}  />
                                        </IonItem>
                                    </IonCardContent>
                                </IonCard>
                                
                            </IonContent>
                        </IonPage>
                        <IonLoading
                            isOpen={showLoading}
                            onDidDismiss={() => setShowLoading(false)}
                            message={'Trwa dodawanie..'}
                            duration={5000}
                        />
                    </IonModal>
                </>
           
    );
}
    // Rzutowanie globalnego state do props
    const mapStateToProps = state => {
        return {
            isLogged: state.user.isLogged,
            userData: state.user.userData,
            allMaps : state.maps.mindmaps
        };
    }
    
    // rzutowanie funkcji do odpowiedniego dispatcha
    const mapDispatchToProps  = dispatch => {
        return {
            handleUserStatus : () => dispatch({type:actionTypes.USER_STATUS, value: {}}),
            handleMapToEdit : () => dispatch({type:actionTypes.SELECT_MAP_TO_EDIT, value: mapToEdit})
        }
    
    }
export default connect(mapStateToProps, mapDispatchToProps)(EditMap);