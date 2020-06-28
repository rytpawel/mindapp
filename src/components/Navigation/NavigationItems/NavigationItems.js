import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>MindMap Builder</NavigationItem>
        <NavigationItem link="/my-projects" >My Projects</NavigationItem>
        <NavigationItem link="/Login" >Get started</NavigationItem>
    </ul>
);

export default navigationItems;