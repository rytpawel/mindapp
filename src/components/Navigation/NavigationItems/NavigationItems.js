import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => {
            
    let navigationItemsClass = classes.NavigationItemsHidden;

    if ( props.showSideMenu ) {
        navigationItemsClass = classes.NavigationItemsActive;
    }
    navigationItemsClass = classes.NavigationItemsActive;
    return (
            <ul className={navigationItemsClass} >
                <NavigationItem link="/" exact>MindMap Builder</NavigationItem>
                <NavigationItem link="/my-projects" >My Projects</NavigationItem>
                <NavigationItem link="/Login" >Get started</NavigationItem>
            </ul> 
        );
}

export default navigationItems;