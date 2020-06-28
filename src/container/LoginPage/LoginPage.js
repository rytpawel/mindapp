import React, {Component} from 'react';

//Library 
import GoogleLogin from 'react-google-login';
// docs: https://www.npmjs.com/package/react-google-login

//Styles
import classes from './LoginPage.module.css';

class LoginPage extends Component {
    
    state = {
        isLogged : false,
        accoutData : null
    }

    render () {
        // responseGoogle;
        const responseGoogleSuccess = (res) => {
            this.setState({isLogged: true, accoutData: res.profileObj});
            console.log(this.state.isLogged);
        }
        const responseGoogleFailure = (res) => {
            this.setState({isLogged: false, accoutData: null});
            console.log(this.state.isLogged);
        }
        
        return (
            <div className={classes.LoginPage}>
                <div>
                    <GoogleLogin
                        clientId="376961690967-ogf1p3bo5239mnoi9pm97hdspp2lsvjd.apps.googleusercontent.com"
                        buttonText="Sign-up with Google Account"
                        onSuccess={responseGoogleSuccess}
                        onFailure={responseGoogleFailure}
                        cookiePolicy={'single_host_origin'}
                        isSignedIn={true}
                    />
                </div>
                
            </div>
        )
    }
}
export default LoginPage;