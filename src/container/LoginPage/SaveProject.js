import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';

class SaveProject extends Component {
    

    uploadFile = () => {
        
        var fileContent = JSON.stringify(this.props.currentMap);
        console.log(fileContent);
        var file = new Blob([fileContent], {type: 'application/json'});
        let date_now = new Date().getMinutes();
        var metadata = {
            'name': 'MindMap'+date_now, // Filename at Google Drive
            'mimeType': 'application/json', // mimeType at Google Drive
            'parents': [this.props.folder_data.id], // Folder ID at Google Drive
          
        };
  
        var accessToken = window.gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
        var form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', file);
  
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.responseType = 'json';
        xhr.onload = () => {
            console.log(xhr.response.id); // Retrieve uploaded file ID.
        };
        xhr.send(form);
                  
      }
    updateFile = (callback) => {
        var fileContent = JSON.stringify(this.props.currentMap);
        var file = new Blob([fileContent], {type: 'application/json'});
        var accessToken = window.gapi.auth.getToken().access_token;
        var xhr = new XMLHttpRequest();
        var fileId = this.props.currentMap.file_id;
        console.log(fileId);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function() {
          if (xhr.readyState != XMLHttpRequest.DONE) {
            return;
          }
          callback(xhr.response);
        };
        xhr.open('PATCH', 'https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=media');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.send(file);
                  
      }
    saveProjectToDrive = () => {
        console.log("Save?");
        this.updateFile(this.callbackUpdate);
        
    }
    callbackUpdate = (res) => {
        console.log(res);
    }

    render () {

            
        return (
            <div>
                <button onClick={this.saveProjectToDrive}>
                    Save project to Google Drive
                </button>
            </div>
        )
    }
}



const mapStateToProps = state => {
    console.log(state);
    return {
        isLogged: state.user.isLogged,
        currentMap : state.maps.currentmap,
        folder_data : state.maps.folderdata
    };
}

// rzutowanie funkcji do odpowiedniego dispatcha
const mapDispatchToProps  = dispatch => {
	return {
		handleLoginStatus: () => dispatch({type: actionTypes.LOGIN_STATUS, value:true})
	}
	
}


export default connect(mapStateToProps, mapDispatchToProps)(SaveProject);
