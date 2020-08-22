// Library
import React, { Component } from 'react';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';


import { addOutline, trash, gitMerge, grid,text,copy } from 'ionicons/icons';

import Wrap from '../../components/hoc/Wrap';
import Editor from '../../components/Editor/Editor';


import classes from './MindMapBuilder.module.css';
import {
    IonContent,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonText,
    IonToast,
    IonLoading,
    IonItemDivider,
    IonItemGroup,
    IonFab, IonFabButton, IonIcon, IonFabList,
    IonAvatar,IonHeader,IonButtons,IonMenuButton,IonModal,IonTextarea,IonCard,IonCardContent,IonCardHeader,IonItemSliding,IonItemOptions,IonItemOption, IonListHeader

} from '@ionic/react';
import { firestore } from './../../firebase';

// core
let diagram = null;
let nodeDataArray = [{ }];
let linkDataArray =  [{ }];

let currentSelectedNode = null;
let currentSelectedID = null;


let multipleSelectedID = null;
let newNode = null;


const InitialState = {
	edit_window: false,
	multipleSelectedHandle : false,
	currentMapModel : 0,
}


let currentMapObject = {};
let map_title = 'Untitled';
let new_text = '';
class MindMapBuilder extends Component {

		state = {
			contextIsOpen: false,
			nodeDataArray : [{ }],
			linkDataArray : [{ }],
		}
		
		constructor(props) {
			super(props);			
			if( this.props.currentMapId === undefined || this.props.currentMapId == '' || this.props.allMaps[this.props.currentMapId].map.nodeDataArray === undefined) {
				this.props.history.push('/my-projects');
			}
		}
		
	// ================================================================== //
	// ======================== UPDATE FIRESTORE ======================== //
	// ================================================================== //
	
	handleSaveMap = async () => {

		const currentMap = diagram.model.toJson();
		const currentMapObject = JSON.parse(currentMap);
		if(currentMapObject !== undefined) {
			if( this.props.isLogged && this.props.userData.user_uid) {
					const entriesRef = firestore.collection('users')
						.doc(this.props.userData.user_uid)
						.collection('maps').doc(this.props.currentMapId[0]).update({"map" : currentMapObject});
				
				console.log(this.props.allMaps[this.props.currentMapId].map);
			}		
		}
	}    

	// ================================================================== //
	// ======================== END OF FIRESTORE ======================== //
	// ================================================================== //
		componentDidUpdate = () => {
			console.log("componentDidUpdate");

			if( this.props.currentMapId === undefined || this.props.currentMapId == '' || this.props.allMaps[this.props.currentMapId].map === undefined) {
				this.props.history.push('/my-projects');
			} else {
					nodeDataArray = this.props.allMaps[this.props.currentMapId].map.nodeDataArray;
					linkDataArray = this.props.allMaps[this.props.currentMapId].map.linkDataArray;
					map_title =  this.props.allMaps[this.props.currentMapId].name ?  this.props.allMaps[this.props.currentMapId].name : "untitled" ;
			}

		}
		
		componentWillUnmount = () => {
			// this.saveToLocalStorage();
			//this.handleSaveMap();
		}

		// saveToLocalStorage = () => {
		// 	localStorage.setItem('appState', JSON.stringify(this.state));
		// }

		componentDidMount = () => {
			this.setState({
				...this.state,
				contextIsOpen: false
			})
			if( this.props.currentMapId === undefined || this.props.currentMapId == '' || this.props.allMaps[this.props.currentMapId].map.nodeDataArray === undefined) {
				this.props.history.push('/my-projects');
			} else {
				nodeDataArray = this.props.allMaps[this.props.currentMapId].map.nodeDataArray;
				linkDataArray = this.props.allMaps[this.props.currentMapId].map.linkDataArray;
				map_title =  this.props.allMaps[this.props.currentMapId].name ?  this.props.allMaps[this.props.currentMapId].name : "untitled" ;
			}
		}



	
		
		handleStickyContextmenu = (data) => {

			var part = data.subject.part;
			currentSelectedNode = part.data;

			this.showContextMenu (part, diagram);

			if( multipleSelectedID!=null) {
				this.joinSelectionNode();
			}
		}

		handleStickyContextmenuBackgroundSingleClicked = (data) => {
			this.hideContextMenu();
		}

		hideContextMenu = () => {
			if(this.state.contextIsOpen) {
				this.setState({
					...this.state,
					contextIsOpen: false
				})
			}
		}

		maybeShowItem = (elt, pred) => {
			if (pred) {
			elt.style.display = "flex";
			} else {
			elt.style.display = "none";
			}
		}
		showContextMenu = (obj, diagram, tool) => {
			
			if(obj) {
				
				currentSelectedNode = obj.data;
				currentSelectedID = obj.key;
			}
			var cmd = diagram.commandHandler;
			
			// let contextMenuDiv = document.getElementById("contextMenu");

			// contextMenuDiv.style.display = "flex";
			// contextMenuDiv.classList.add("show-menu");
			if(!this.state.contextIsOpen) {
				this.setState({
					...this.state,
					contextIsOpen: true
				})
			}
			
			// this.maybeShowItem(document.getElementById("remove"), cmd.canDeleteSelection());
			// this.maybeShowItem(document.getElementById("paste"), cmd.canPasteSelection());
			// this.maybeShowItem(document.getElementById("copy"), cmd.canCopySelection());
			// this.maybeShowItem(document.getElementById("add"), cmd.canCopySelection());


				
		}
		editSelectionNode = () => {

			diagram.currentTool.stopTool();


			if ( newNode != null ) {
				currentSelectedNode = newNode.data;
				currentSelectedID = newNode.data.key;
				this.setState({
					edit_window: true
				  });
			} else if( currentSelectedNode != null) { 
				
				this.setState({
					edit_window: true
				  });
			}
		}
		deleteSelectionNode = () => {
			diagram.commandHandler.deleteSelection();
			diagram.currentTool.stopTool();
			this.handleSaveMap();
		}
		pasteSelectionNode = () => {
			diagram.commandHandler.pasteSelection();
			diagram.currentTool.stopTool();
		}
		copySelectionNode = () => {
			diagram.commandHandler.copySelection();
			diagram.currentTool.stopTool();
		}
		joinSelectionNode = () => {
			
			if( multipleSelectedID == null && currentSelectedID != null) {
				multipleSelectedID = currentSelectedID;
				return 0
			} else if(  multipleSelectedID != null && currentSelectedID != null ) {
				diagram.startTransaction("add node and link");
				var newlink = { from: multipleSelectedID, to: currentSelectedID };
				diagram.model.addLinkData(newlink);
				diagram.commitTransaction("add node and link");
				multipleSelectedID = null;
			}
			
		}

		addNodeAndLink = (e, b) => {
			if( currentSelectedID != null) {		
				diagram.startTransaction("add node and link");
				// have the Model add the node data
				var newnode = { key: diagram.model.nodeDataArray.length };
				
				diagram.model.addNodeData(newnode);
				// locate the node initially where the parent node is
				// diagram.findNodeForData(newnode).location = node.location;
				// and then add a link data connecting the original node with the new one
				var newlink = { from: currentSelectedID, to: newnode.key };
				diagram.model.addLinkData(newlink);
				// finish the transaction -- will automatically perform a layout
				diagram.commitTransaction("add node and link");
			}
			diagram.currentTool.stopTool();
		}
		
	// End Context Menu Functions

	
    	initDiagram = () => {
		

		window.addEventListener('beforeunload', (event) => {
			// Cancel the event as stated by the standard.
			event.preventDefault();
			// Chrome requires returnValue to be set.
			event.returnValue = '';
			// this.saveToLocalStorage();
		});
		  
	
        const $ = go.GraphObject.make;
		// set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
		//let contextMenuDiv = document.getElementById("contextMenu");
		let myContextMenu = $(go.HTMLInfo, {
			show: this.showContextMenu,
			hide: this.hideContextMenu
		});


        diagram =
          $(go.Diagram,
            {
              'undoManager.isEnabled': true,  
              'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
            	model: $(go.GraphLinksModel, {
                	linkKeyProperty: 'key'  
                })
			});
			
			diagram.contextMenu = myContextMenu;
		
        	diagram.nodeTemplate =
				$(go.Node, 'Auto', 
				{ contextMenu: myContextMenu },
           		new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
				$(go.Shape, 'RoundedRectangle', 
					{ 
						fill: "#fafafa", 
						portId: "", 
						fromLinkable: true, 
						toLinkable: true, 
						cursor: "pointer"
					}
				),
			  	$(go.TextBlock,
					{ 
						margin: new go.Margin(5,5,5,5)
					}, new go.Binding("text", "text")),
				);

          	diagram.linkTemplate =
				$(go.Link, {
					routing: go.Link.AvoidsNodes,
					corner: 10,
					curve: go.Link.JumpGap
				},
				new go.Binding("points").makeTwoWay(),  
				$(go.Shape),
				$(go.Shape, { toArrow: "" })
		  		);
			
			diagram.layout = $(go.TreeLayout);
									
		
			diagram.addDiagramListener("ObjectSingleClicked", this.handleStickyContextmenu);
			diagram.addDiagramListener("BackgroundSingleClicked", this.handleStickyContextmenuBackgroundSingleClicked);
			diagram.addModelChangedListener( (evt) => {
				if (evt.isTransactionFinished) {
					console.log("ZAPISZ?");
					//this.handleSaveMap();
				}
			});

			  
			return diagram;

	}
    handleModelChange = (changes) => {

		const currentMap = diagram.model.toJson();
		currentMapObject = JSON.parse(currentMap);

		if ( changes.insertedNodeKeys !== undefined  || 
				changes.insertLinkKeys !== undefined ) {

			//this.handleSaveMap(currentMapObject);
		}


		
		// console.log("ZMIANA", changes);

		if ( changes.insertedNodeKeys && changes.insertedNodeKeys[0] > 0) {
			
			newNode = diagram.findNodeForKey(changes.insertedNodeKeys[0]);
			if (newNode === null) {
				return;  
			}
			this.editSelectionNode();
		}
	}


	changeTextHandler = (value) => {
		new_text = value;
		console.log(new_text);
		// var model = diagram.model;
		// var data = model.findNodeDataForKey(currentSelectedNode.key);
		// if (data) {
		// 	model.startTransaction("modified property");
		// 	model.set(data, "text", value);
		// 	// ... maybe modify other properties and/or other data objects
		// 	model.commitTransaction("modified property");
		// }

	}
	saveEvent = (event) => {
		this.setState({
			edit_window: false
		  });
		var model = diagram.model;
		var data = model.findNodeDataForKey(currentSelectedNode.key);
		if (data) {
			model.startTransaction("modified property");
			model.set(data, "text", new_text);
			// ... maybe modify other properties and/or other data objects
			model.commitTransaction("modified property");
			this.handleSaveMap();
		}

	}
	handleDiagramEvent = (e) => {
		console.log("handleDiagramEvent",e);
	}


	
	

    render() {


        return (
			<IonPage>
            	<IonHeader>
                	<IonToolbar>
						<IonButtons slot="start">
						<IonMenuButton></IonMenuButton>
						</IonButtons>
						<IonTitle>
							{map_title}
						</IonTitle>
                	</IonToolbar>
            	</IonHeader>
			
            	<IonContent fullscreen={true}>

				
            <Wrap>
                <div className={classes.MindmapBuilder}>
                <ReactDiagram
                    initDiagram={this.initDiagram}
                    divClassName={classes.DiagramComponent}
                    nodeDataArray={this.props.allMaps[this.props.currentMapId].map.nodeDataArray}
                    linkDataArray={this.props.allMaps[this.props.currentMapId].map.linkDataArray}
                    onModelChange={this.handleModelChange}
                    />
					<IonFab activated={this.state.contextIsOpen}  vertical="bottom" horizontal="end" slot="fixed">
						<IonFabButton color="medium" size="small">
							<IonIcon  icon={grid} />
						</IonFabButton>
						<IonFabList side="top">
							<IonFabButton className={classes.IonAdd} color="tertiary" onClick={this.addNodeAndLink}>
								<IonIcon icon={addOutline} />
							</IonFabButton>
						</IonFabList>
						<IonFabList side="start">
							<IonFabButton color="light" onClick={this.joinSelectionNode}>
								<IonIcon icon={gitMerge} />
							</IonFabButton>
							<IonFabButton color="light" onClick={this.editSelectionNode}>
								<IonIcon icon={text} />
							</IonFabButton>
							<IonFabButton id="copy" color="light" onClick={this.copySelectionNode}>
								<IonIcon icon={copy} />
							</IonFabButton>
							{/* <IonFabButton color="light" onClick={this.pasteSelectionNode}>
								<IonIcon icon={clipboard} />
							</IonFabButton> */}
							<IonFabButton color="danger" onClick={this.deleteSelectionNode}>
								<IonIcon icon={trash} />
							</IonFabButton>
						</IonFabList>
					</IonFab>

					

					
					<Editor enabled={this.state.edit_window}
							selectedObject = {currentSelectedNode}
							changeTextHandler =  {this.changeTextHandler} 
							saveEvent = {this.saveEvent}>
					</Editor>
                </div>
				{/* <div className={classes.SavedMap}>
					<textarea defaultValue={this.state.currentMapModel} name="saved_map"></textarea>
				</div> 
				<SaveProject/>*/}
            </Wrap>
			</IonContent>
				</IonPage>
            
        )
    }
}



// Rzutowanie globalnego state do props
const mapStateToProps = state => {
    console.log(state);
    return {
        isLogged: state.user.isLogged,
		currentMapId : state.maps.currentmapid,
		allMaps : state.maps.mindmaps,
		userData: state.user.userData
    };
}

// rzutowanie funkcji do odpowiedniego dispatcha
const mapDispatchToProps  = dispatch => {
	return {
		handleLoginStatus: () => dispatch({type: actionTypes.LOGIN_STATUS, value:true})
	}
	
}


export default connect(mapStateToProps, mapDispatchToProps)(MindMapBuilder);