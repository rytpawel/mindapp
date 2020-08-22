import React, {Component} from 'react';
import classes from './StickyButton.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faPencilAlt, faCopy, faPaste, faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import propTypes from 'prop-types';

class StickyButton extends Component {

    render () {
        let stickyButton = null;
        switch (this.props.type) {
            case ('add'):
                stickyButton = <li className={[classes.StickyButtonCircle, classes.Add].join(' ')} id={this.props.type} onClick={this.props.action} ><FontAwesomeIcon icon={faPlus} /></li>
                break;
            case ('remove'):
                stickyButton = <li className={classes.StickyButtonCircle} id={this.props.type} onClick={this.props.action} ><FontAwesomeIcon icon={faTimes} /></li>
                break;
            case ('edit'):
                stickyButton = <li className={classes.StickyButtonCircle} id={this.props.type} onClick={this.props.action} ><FontAwesomeIcon icon={faPencilAlt} /></li>
                break;
            case ('copy'):
                stickyButton = <li className={classes.StickyButtonCircle} id={this.props.type} onClick={this.props.action} ><FontAwesomeIcon icon={faCopy} /></li>
                break;
            case ('paste'):
                stickyButton = <li className={classes.StickyButtonCircle} id={this.props.type} onClick={this.props.action} ><FontAwesomeIcon icon={faPaste} /></li>
                break;
            case ('join'):
                stickyButton = <li className={classes.StickyButtonCircle} id={this.props.type} onClick={this.props.action} ><FontAwesomeIcon icon={faCodeBranch} /></li>
                break;
            default:
                stickyButton = null;
        }

        return stickyButton;
    }



}
StickyButton.propTypes = {
    type: propTypes.string.isRequired
    
}
export default StickyButton;