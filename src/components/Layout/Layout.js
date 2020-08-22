import React, {Component} from 'react';
import classes from './Layout.module.css';
import Wrap from '../hoc/Wrap';

class Layout extends Component {

    state = {
        showSideMenu: false
    }

    toggleMenu = () => {
        const currencyState = this.state.showSideMenu;
        this.setState({showSideMenu:!currencyState});
    }
   

    render () {
        return ( 
            <Wrap>
                {/* <GoogleWidgetLogin 
                    action={this.toggleMenu}
                /> */}
                <div id="SideMenu" className={classes.SideMenu}>

                </div>
                <main className={classes.myContent}>
                    {this.props.children}
                </main>
            </Wrap>
        )
    }
}

export default Layout;