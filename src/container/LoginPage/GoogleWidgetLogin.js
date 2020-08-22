import React, {Component} from 'react';
import { Redirect } from 'react-router';

import { gapi, loadAuth2 } from 'gapi-script';

//Styles
import classes from './GoogleWidgetLogin.module.css';
import MenuProfile from '../../components/Layout/MenuProfile/MenuProfile';


let clientId = '376961690967-ogf1p3bo5239mnoi9pm97hdspp2lsvjd.apps.googleusercontent.com';
let developerKey = 'AIzaSyANmSfLjbX5qWBZHLV3XKDVbth6EfjQ40U';
let scope = ['https://www.googleapis.com/auth/drive.readonly'];

class GoogleWidgetLogin extends Component {
    
    constructor( props ) {
        super( props );
        this.state = {
            user: null
        }
    }
    saveToLocalStorage = () => {
        console.log('saveToLocalStorage');
        localStorage.setItem('userData', JSON.stringify(this.state));
        
    }
    async componentDidMount() {
        console.log("Wywołanie metody: componentDidMount");

        let auth2 = await loadAuth2(clientId, '');

        if (auth2.isSignedIn.get()) {
            this.updateUser(auth2.currentUser.get())
        } else {
            this.attachSignin(document.getElementById('GoogleWidget'), auth2);
        }
        this.saveToLocalStorage();
    }

    async componentDidUpdate() {
        console.log("Wywołanie metody: componentDidUpdate");
        if(!this.state.user) {
            let auth2 = await loadAuth2(clientId, '')
            this.attachSignin(document.getElementById('GoogleWidget'), auth2);
        }
        this.saveToLocalStorage();
    }

    updateUser(currentUser) {
        console.log("Wywołanie metody: updateUser");
        let name = currentUser.getBasicProfile().getName()
        let profileImg = currentUser.getBasicProfile().getImageUrl()
        this.setState({
            user: {
                name: name,
                profileImg: profileImg
            }
        })
    }

    attachSignin(element, auth2) {
        console.log("Wywołanie metody: attachSignin");
        auth2.attachClickHandler(element, {},
            (googleUser) => {
                this.updateUser(googleUser);
            }, (error) => {
                console.log(JSON.stringify(error))
            });
    }

    signOut = () => {
        console.log("Wywołanie metody: signOut");
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(() => {
            this.setState({ user: null })
            console.log('User signed out.');
        });
    }


    
    render () {
    
       
            return (
                <div className="container">
                    <MenuProfile 
                        action={this.props.action} 
                        user={this.state.user} 
                        />
                    <span onClick={this.signOut}>Wyloguj się</span>
                   
                </div>
            );
       
    }
}
export default GoogleWidgetLogin;