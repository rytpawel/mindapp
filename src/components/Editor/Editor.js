import React, { useState, useEffect,useRef} from 'react';
import Wrap from '../hoc/Wrap';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import { TwitterPicker } from 'react-color';

//Styles
import classes from './Editor.module.css';
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
    IonAvatar,IonHeader,IonButtons,IonMenuButton,IonModal,IonTextarea,IonCard,IonCardContent,IonCardHeader, isPlatform

} from '@ionic/react';
import {Plugins, CameraResultType, CameraSource} from '@capacitor/core'
import {storage} from '../../firebase';

const { Camera } = Plugins;
const placeholder = 'https://firebasestorage.googleapis.com/v0/b/mindapp-76c92.appspot.com/o/UI%2Fplaceholder.jpg?alt=media';

const Editor = (props) => { 
        const [pictureUrl, setPictureUrl] = useState('');
        const fileInputRef = useRef();
        const [showLoading, setShowLoading] = useState(false);
        const [placeholder_image, setPlaceholderImage] = useState(placeholder);
        const [newNode, setNewNode] = useState({
            text : '',
            desc : '',
            source : '',
            color: '',
            color_font : ''
        });

        

        
        useEffect(()=>{
            return () => {
                if(pictureUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(pictureUrl);
                }
            } 
        }, [pictureUrl]);

        useEffect(()=>{
            if(props.selectedObject !== undefined && props.selectedObject !== null ) {
                if(props.selectedObject.source === undefined || props.selectedObject.source === null  || props.selectedObject.source == '' ) {
                    setNewNode({
                        ...props.selectedObject
                    });
                    setPlaceholderImage(placeholder);

                } else {
                    setNewNode(props.selectedObject);
                    setPlaceholderImage(props.selectedObject.source);
                }
            }
        }, [props.enabled]);

        const handleFileChange = (event) => {
            
            if ( event.target.files.length > 0) {
                setShowLoading(true);
                
                const file = event.target.files.item(0);
                const pictureUrl = URL.createObjectURL(file);

                setPictureUrl(pictureUrl);
                savePicture(pictureUrl);
                
            }
        }

        const savePicture  = async (blobURL) => {
            
            if ( props.userData.user_uid !== undefined && props.userData.user_uid !== null ) {
                const pictureRef = storage.ref(`/users/${props.userData.user_uid}/pictures/${Date.now()}`);
                const response = await fetch(blobURL);
                const blob = await response.blob();
                const snapshot = await pictureRef.put(blob);
                const url = await snapshot.ref.getDownloadURL();

                setNewNode({
                    ...newNode,
                    source: url
                })
                setPlaceholderImage(url);
                setShowLoading(false);
                return url;
            }
            
        }

        const handleText = (txt) => {
            setNewNode({
                ...newNode,
                text: txt
            })
        }

        const handleDesc = (desc) => {
            setNewNode({
                ...newNode,
                desc: desc
            })
        }
        const handleChangeColor = (color, event) => {
            console.log(color.hex);
            setNewNode({
                ...newNode,
                color: color.hex,
                color_font: '#ffffff'
            })
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
                <IonModal 
					isOpen={props.enabled} 
					cssClass={classes.CustomModal}
					swipeToClose={true}
					animated={true}
					onDidDismiss={() => {props.saveEvent(newNode)} }
				>
					<IonPage>
						<IonContent>
							<IonToolbar>
								<IonTitle>
									Dodaj nowy
								</IonTitle>
								<IonButtons slot="end">
									<IonButton className={classes.BtnClose}  onClick={() => {setPictureUrl(placeholder_image); props.saveEvent(newNode);} }>Dodaj</IonButton>
								</IonButtons>
							</IonToolbar>
							<IonCard>
                        		<IonCardContent>
                                    <IonItem>
                                        <IonLabel color="dark" position="floating">Nazwa</IonLabel>
                                        <IonTextarea value={newNode.text} placeholder="Enter name of Node..." onIonChange={(e) => handleText(e.detail.value)}></IonTextarea>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel color="dark" position="floating">Krótki opis</IonLabel>
                                        <IonTextarea value={newNode.desc} placeholder="Enter more information here..." onIonChange={(e) => handleDesc(e.detail.value)}></IonTextarea>
                                    </IonItem>
                                    <IonItem>
                                    
                                        <TwitterPicker onChangeComplete={handleChangeColor} />

                                    </IonItem>
                                    <IonItem>
                                        <IonLabel color="dark" position="floating">Image</IonLabel>
                                        <br></br>
                                        <input hidden type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef}/>
                                        <img src={placeholder_image} alt="" onClick={handleImageLoad}  />
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
                
        )
}


// Rzutowanie globalnego state do props
const mapStateToProps = state => {
    return {
        isLogged: state.user.isLogged,
        userData: state.user.userData,
    };
}

export default connect(mapStateToProps)(Editor);