import React, { Component } from 'react';
import Wrap from '../hoc/Wrap';
import {IonButton, IonItem, IonTextarea } from '@ionic/react';

//Styles
import classes from './Editor.module.css';

class Editor extends Component { 
    render() {
        let editorContent = null;

       
		if(this.props.enabled) {
            editorContent = 
                <div id="Editor" style={{display: "flex"}} className={classes.Editor}>
                    <form>
                        <IonItem>
                            <IonTextarea placeholder="Enter more information here..." onIonChange={e => this.props.changeTextHandler(e.detail.value)}  value={this.props.selectedObject.text} onChange={this.props.changeTextHandler}></IonTextarea>
                        </IonItem>
                        <IonButton onClick={this.props.saveEvent} value="edit" color="primary">OK</IonButton>
                    </form>
                </div>;
        }
        
      
        return (
            <Wrap>
                {editorContent}
                
            </Wrap>
        )
    }
}

export default Editor;