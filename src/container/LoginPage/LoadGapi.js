import React, {Component} from 'react';
import useScript from '../../hooks/useScript';

const LoadGapi = (props) => {
    useScript('https://apis.google.com/js/api.js', props.action);
    return true;
}
export default LoadGapi;