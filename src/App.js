import React, { Component, useState, useEffect } from 'react';

//Library
import {Route, Switch, Redirect} from 'react-router-dom';
import {
	IonApp,
	IonHeader,
	IonContent,
	IonToolbar,
	IonTitle,
	IonMenuButton,
	IonButtons,
	IonLoading
} from '@ionic/react';

// Container
import MindMapBuilder from './container/MindMapBuilder/MindMapBuilder';
import AllProjectsPage from './container/AllProjectsPage/AllProjectsPage';

// Components
import Layout from './components/Layout/Layout';
import Menu from './components/Layout/Menu';
import LoginPage from './container/LoginPage/LoginPage';
import { auth } from './firebase';
import { firestore } from './firebase';

import {connect} from 'react-redux';
import * as actionTypes from './store/actions';
import Profile from './container/LoginPage/Profil';

import NewMap from './container/MindMapBuilder/NewMap';
import RegisterPage from './container/LoginPage/Register';


const loginStatusObject = {
    isLogged: false,
    userData: {},
    loggedMethod : '',
}
let all_maps;

const App = (props) => {
	let [allMyMaps, updateAllMyMaps] = useState();
    let [isDeleted, setIsDeleted] = useState(false);
    let [showActionSheet, setShowActionSheet] = useState(false);
	let [showDeletedAlert, setShowDeletedAlert] = useState(false);
	

	const [authState, setAuthState] = useState({
		loading: true, 
		loggedIn:false 
	});

		useEffect(() => {
			auth.onAuthStateChanged((user) => {
				setAuthState({loading: false, loggedIn: Boolean(user)});
				if(user != null) {
					user.providerData.forEach(function (profile) {
						console.log(profile);
						loginStatusObject.userData = { 
							user_uid : profile.uid,
							user_email:profile.email, 
							user_name:profile.displayName, 
							user_image_url:profile.photoURL
						};

						if ( loginStatusObject.userData.user_name == undefined || loginStatusObject.userData.user_name == null || loginStatusObject.userData.user_name == '' ) {
							loginStatusObject.userData.user_name = profile.email;
							
						}
						loginStatusObject.loggedMethod = profile.providerId;
					});

					

					loginStatusObject.isLogged = true;
					if(!props.isLogged) {
						props.handleUserStatus();
					}
					console.log(loginStatusObject);
					let updateMyMaps = {};
					const entriesRef = firestore.collection('users').doc(loginStatusObject.userData.user_uid).collection('maps');
					entriesRef.onSnapshot((snapshot) => {
						snapshot.docChanges().forEach(change => {
        
							if (change.type === "added") {
								console.log('added');
							}
							if (change.type === "removed") {
								console.log("COS ZOSTAłO USUNIETE");
								triggerGet(loginStatusObject.userData.user_uid);
								
							}
							console.log(change.type);
						});
						snapshot.docs.forEach((doc)=>{
							let map_tmp = doc.data();
							updateMyMaps = {
								...updateMyMaps,
								[doc.id] : map_tmp
							}
							all_maps = updateMyMaps;
							props.handleMindMaps();
						})
					});
				} else {
					console.log("REDIRECT TO LOGIN");
					return <Redirect to='/login' />
					
				}
			})
			
			
              
		}, []);

		const triggerGet = (uid) => {
			let updateMyMaps = {};
			const entriesRef = firestore.collection('users').doc(uid).collection('maps');
			entriesRef.get().then((res) => {
				if (  res.docs.length < 1 ){
					updateAllMyMaps(null);
					all_maps = {};
					props.handleMindMaps();
				} else {
					res.docs.forEach(( doc )=> {
						let map_tmp = doc.data();
							updateMyMaps = {
								...updateMyMaps,
								[doc.id] : map_tmp
							}
							all_maps = updateMyMaps;
							props.handleMindMaps();
					})
				}
			})
		}

		if( authState.loading ) {
			return <IonLoading isOpen></IonLoading>
		}
		
		return (
			<IonApp>
				<Menu/>
				<IonContent>
					<Layout>
						<Switch>
							
							<Route path="/my-projects" component={AllProjectsPage} />
							<Route path="/profile" component={Profile} />
							<Route path="/login" exact component={LoginPage} />
							<Route path="/register" exact component={RegisterPage} />
							<Route path="/" exact component={MindMapBuilder} />
						</Switch>
					</Layout>
				</IonContent>
			</IonApp>
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
		handleUserStatus : () => dispatch({type:actionTypes.USER_STATUS, value: loginStatusObject}),
		handleMindMaps : () => dispatch({type:actionTypes.LOAD_MAP, value: all_maps})
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(App);