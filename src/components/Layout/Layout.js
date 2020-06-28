import React, {Component} from 'react';
import classes from './Layout.module.css';
import Wrap from '../hoc/Wrap';

//components
import NavigationItems from '../Navigation/NavigationItems/NavigationItems';
class Layout extends Component {

    state = {
        showSideMenu: false
    }

    render () {
        return ( 
            <Wrap>
                <div id="Menu" className={classes.Menu}>
                    <NavigationItems/>
                </div>
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