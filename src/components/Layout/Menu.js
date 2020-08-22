import React, { Component, useState } from 'react';
import { IonBadge, 
        IonMenu, 
        IonHeader,IonTitle, 
        IonToolbar, 
        IonContent, 
        IonList, 
        IonItem, 
        IonRouterOutlet,IonMenuToggle, 
        IonAvatar, 
        IonLabel, 
        IonIcon,
        IonFooter
       
     } from '@ionic/react';

import { addCircleOutline, 
        documentTextOutline,
        logInOutline,
        personOutline,
        helpCircleOutline } from 'ionicons/icons';


import NavigationItem from './../Navigation/NavigationItems/NavigationItem/NavigationItem';
import Wrap from '../hoc/Wrap';
import LogOut from '../../container/LoginPage/Logout';
import {connect} from 'react-redux';
import {request} from '../../container/AllProjectsPage/UserData';

const Menu = (props) => {
    const [menuTitle, setMenuTitle] = useState('');
    const [imageSrc, setimageSrc] = useState('');
    const [quantityMaps, setQuantityMaps] = useState(0);
    let userMinidata = '';
    const getImage = async () => {
        if(props.isLogged && props.userData.user_image_url) {
            const temp = request(props.userData.user_image_url);
            temp.then((e)=>{               
                setimageSrc( e.url);
            })
        }
        
    }
    const countMaps = () => {
        if ( props.isLogged ) {
            var count = Object.keys(props.mindMaps).length;
            if (count != quantityMaps) {
                setQuantityMaps(count);
            }
        }
    }

    getImage();
    countMaps();
    if(props.isLogged && props.userData.user_name ) {
        if(props.userData.user_image_url) {
            userMinidata = <IonItem>
                <IonAvatar slot="start">
                    <img src={imageSrc} />
                </IonAvatar>
                <IonLabel>{props.userData.user_name}</IonLabel>
            </IonItem> ;
        } else {
            userMinidata = <IonItem>
                <IonAvatar slot="start">
                    <img src="https://ionicframework.com/docs/demos/api/avatar/avatar.svg" />
                </IonAvatar>
                <IonLabel>{props.userData.user_name}</IonLabel>
            </IonItem> ;
        }
    }
     else {
        userMinidata = <IonTitle>
                            Menu
                        </IonTitle>;
    }
    return (
        <Wrap>
            <IonMenu side="start" menuId="first" contentId="content1">
                <IonHeader>
                    <IonToolbar>
                            {userMinidata}
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonMenuToggle auto-hide="true">
                            <NavigationItem link="/" exact>
                                <IonItem lines="none">
                                    <IonIcon icon={addCircleOutline} slot="start" />
                                    <IonLabel>
                                        <h2>Edytor</h2>
                                    </IonLabel>
                                </IonItem>
                            </NavigationItem>
                            <NavigationItem link="/new-map" exact>
                                <IonItem lines="none">
                                    <IonIcon icon={addCircleOutline} slot="start" />
                                    <IonLabel>
                                        <h2>Nowy projekt</h2>
                                    </IonLabel>
                                </IonItem>
                            </NavigationItem>
                           
                            <NavigationItem hidden={!props.isLogged} link="/my-projects">
                                <IonItem lines="none">
                                    <IonIcon icon={documentTextOutline} slot="start" />
                                    <IonLabel>
                                        <h2>Moje projekty</h2>
                                    </IonLabel>
                                    <IonBadge color="primary" slot="end">{quantityMaps}</IonBadge>
                                </IonItem>
                            </NavigationItem>
                            
                            <NavigationItem hidden={!props.isLogged} link="/profile">
                                <IonItem lines="none">
                                    <IonIcon icon={personOutline} slot="start" />
                                    <IonLabel>
                                        <h2>Mój profil</h2>
                                    </IonLabel>
                                </IonItem>
                            </NavigationItem>
                            <NavigationItem  link="/faq">
                                <IonItem  lines="none">
                                    <IonIcon icon={helpCircleOutline} slot="start" />
                                    <IonLabel>
                                        <h2>FAQ</h2>
                                    </IonLabel>
                                </IonItem>
                            </NavigationItem>
                        </IonMenuToggle>
                    </IonList>
                </IonContent>
                <IonFooter class="bar-stable">
                    <IonMenuToggle auto-hide="true">
                        <IonList>
                            <LogOut/>
                            <NavigationItem hidden={props.isLogged} link="/login">
                                <IonItem hidden={props.isLogged} lines="none">
                                    <IonIcon icon={logInOutline} slot="start" />
                                    <IonLabel>
                                        <h2>Zaloguj się</h2>
                                    </IonLabel>
                                </IonItem>
                            </NavigationItem>
                        </IonList>
                    </IonMenuToggle>
                </IonFooter>
            </IonMenu>
            <IonRouterOutlet id="content1"></IonRouterOutlet>
        </Wrap>
    )
}

// Rzutowanie globalnego state do props
const mapStateToProps = state => {
    return {
        isLogged: state.user.isLogged,
        userData: state.user.userData,
        mindMaps: state.maps.mindmaps
    };
}


export default connect(mapStateToProps)(Menu);
