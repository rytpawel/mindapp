// Library
import React, { useState, useEffect } from 'react';
import * as go from 'gojs';
// import DoubleTreeLayout from 'gojs/extensions/DoubleTreeLayout';

import { ReactDiagram } from 'gojs-react';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';


import { addOutline, trash, gitMerge, grid,text,copy } from 'ionicons/icons';


import Editor from '../../components/Editor/Editor';


import classes from './MindMapBuilder.module.css';
import {
    IonContent,
    IonPage,
    IonTitle,
    IonToolbar,
	IonFab, 
	IonFabButton, 
	IonIcon, 
	IonFabList,
	IonHeader,
	IonButtons,
	IonMenuButton
} from '@ionic/react';
import { firestore } from './../../firebase';

// core
let diagram = null;



let currentSelectedID = null;


let multipleSelectedID = null;
let newNode = null;


const InitialState = {
	edit_window: false,
	multipleSelectedHandle : false,
	currentMapModel : 0,
}


let currentMapObject = {};

let nodeDataArray = [{ }];
let linkDataArray =  [{ }];
let map_title = 'Untitled';


const MindMapBuilder = (props) => {
	let [currentNode, setCurrentNode] = useState({});
	let [contextIsOpen, setContextIsOpen] = useState(false);
	let [editorIsOpen, setEditorIsOpen] = useState(false);
	let [refresh, triggerRefresh] = useState('');
	let [node, setNode] = useState('');

	if ( !(props.currentMapId === undefined || props.currentMapId == '' )) {
		if(node == '' || node != props.allMaps[props.currentMapId].map.nodeDataArray){
			setNode(props.allMaps[props.currentMapId].map.nodeDataArray);
		}
			
	}
	
	useEffect(() => {
		console.log("useEffect => First open");
		if( props.currentMapId === undefined || props.currentMapId == '') {
			console.log(props.userData.isLogged);
			if( props.userData.isLogged  === undefined || !props.userData.isLogged ) {
				console.log("Redirect to Login");
				props.history.push('/login');
			} else {
				console.log("Redirect to my projects");
				props.history.push('/my-projects');
			}
			
		} else if ( props.allMaps[props.currentMapId].map.nodeDataArray === undefined || props.allMaps[props.currentMapId].map.linkDataArray === undefined) {
			console.log("useEffect => Nowa mapa");
			map_title =  props.allMaps[props.currentMapId].name ?  props.allMaps[props.currentMapId].name : "untitled" ;
		} else {
			console.log('useEffect => Mapa już była edytowana');
			map_title =  props.allMaps[props.currentMapId].name ?  props.allMaps[props.currentMapId].name : "untitled" ;
			nodeDataArray = props.allMaps[props.currentMapId].map.nodeDataArray;
			linkDataArray = props.allMaps[props.currentMapId].map.linkDataArray	;	
			
		}
	}, []);
	useEffect(() => {
		console.log("useEffect => sec open");
		if( props.currentMapId === undefined || props.currentMapId == '') {
			if( props.userData.isLogged  === undefined || !props.userData.isLogged ) {
				console.log("Redirect to Login");
				props.history.push('/login');
			} else {
				console.log("Redirect to my projects");
				props.history.push('/my-projects');
			}
			
		} else if ( props.allMaps[props.currentMapId].map.nodeDataArray === undefined || props.allMaps[props.currentMapId].map.linkDataArray === undefined) {
			console.log("useEffect => Nowa mapa");
			map_title =  props.allMaps[props.currentMapId].name ?  props.allMaps[props.currentMapId].name : "untitled" ;
			nodeDataArray = props.allMaps[props.currentMapId].map.nodeDataArray;
			linkDataArray = props.allMaps[props.currentMapId].map.linkDataArray	;
		} else {
			console.log('useEffect => Mapa już była edytowana');
			map_title =  props.allMaps[props.currentMapId].name ?  props.allMaps[props.currentMapId].name : "untitled" ;
			nodeDataArray = props.allMaps[props.currentMapId].map.nodeDataArray;
			linkDataArray = props.allMaps[props.currentMapId].map.linkDataArray	;	
			if(refresh == ''){
				triggerRefresh('refresh');
			}
		}
	}, [node]);
	



	// useEffect(() => {
	// 	console.log("useEffect => refresh");
	// 	if( props.currentMapId === undefined || props.currentMapId == '') {
	// 		props.history.push('/my-projects');
	// 	} else if ( props.allMaps[props.currentMapId].map.nodeDataArray === undefined || props.allMaps[props.currentMapId].map.linkDataArray === undefined) {
	// 		console.log("useEffect => Nowa mapa");
	// 		map_title =  props.allMaps[props.currentMapId].name ?  props.allMaps[props.currentMapId].name : "untitled" ;
	// 	} else {
	// 		console.log('useEffect => Mapa już była edytowana');
	// 		map_title =  props.allMaps[props.currentMapId].name ?  props.allMaps[props.currentMapId].name : "untitled" ;
	// 		nodeDataArray = props.allMaps[props.currentMapId].map.nodeDataArray;
	// 		linkDataArray = props.allMaps[props.currentMapId].map.linkDataArray	;	
	// 		console.log(nodeDataArray,linkDataArray);
	// 	}

	// }, [refresh])
	
	const handleSaveMap = async () => {
		const currentMap = diagram.model.toJson();
		const currentMapObject = JSON.parse(currentMap);
		if(currentMapObject !== undefined) {
			if( props.isLogged && props.userData.user_uid) {
					const entriesRef = firestore.collection('users')
						.doc(props.userData.user_uid)
						.collection('maps').doc(props.currentMapId[0]).update({"map" : currentMapObject});
				
				console.log(currentMapObject);
				triggerRefresh('yes');
			}		
		}
	}    

	const showContextMenu = (obj, diagram, tool) => {
		if ( obj !== undefined ) {
			console.log("showContextMenu" , obj.subject.part.data);
		}
		setContextIsOpen(true);
		
		// if ( !contextIsOpen ) {
		// 	setContextIsOpen(true);
		// }
	}
	const handleStickyContextmenu = (data) => {
		console.log("handleStickyContextmenu" , data.subject.part.data);
		setCurrentNode(data.subject.part.data);
		setContextIsOpen(true);
	}

	const handleStickyContextmenuBackgroundSingleClicked = (data) => {
		hideContextMenu();
	}

	const hideContextMenu = () => {
		console.log('hideContextMenu');
		
		setContextIsOpen(false);
		setCurrentNode(null);
		
	}

	const editSelectionNode = () => {

		diagram.currentTool.stopTool();
		if (currentNode !== undefined && currentNode !== null && currentNode.key !== undefined ) {
			setEditorIsOpen(true);
			setContextIsOpen(false);
		}

	}
	const deleteSelectionNode = () => {
		diagram.commandHandler.deleteSelection();
		diagram.currentTool.stopTool();
		handleSaveMap();
	}
	const pasteSelectionNode = () => {
		diagram.commandHandler.pasteSelection();
		diagram.currentTool.stopTool();
	}
	const copySelectionNode = () => {
		diagram.commandHandler.copySelection();
		diagram.currentTool.stopTool();
	}
	const joinSelectionNode = () => {
		
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

	const addNodeAndLink = () => {
		
		if ( currentNode ) {
			
			diagram.startTransaction("add node and link");
			let key_generator = 1 + Math.random() * (99999 - 1);
			let new_location_x = "0";
			let new_location_y = "0";
			if ( diagram.findNodeForKey(0) === undefined || diagram.findNodeForKey(0) === null ) {
				key_generator = 0 ;
				new_location_x = "0";
				new_location_y = "0";
			}
			let currentLocation = go.Point.parse(currentNode.location);
			console.log();

			if( currentLocation.x >= 0 ) {
				new_location_x = currentLocation.x + 150;
				
			} else {
				new_location_x = currentLocation.x - 150;
			}

			
			new_location_y = currentLocation.y;
			
			
			let new_location = new_location_x + ' ' + new_location_y;

			let new_node = { key: key_generator, text : '', desc:'', location: new_location};
			diagram.model.addNodeData(new_node);

			let new_link = { from: currentNode.key, to: new_node.key };
			diagram.model.addLinkData(new_link);

			diagram.commitTransaction("add node and link");
			diagram.currentTool.stopTool();
			setCurrentNode(new_node);
		}
	}
		
	// End Context Menu Functions
	// Abstract colors
	let Colors = {
        "red": "#be4b15",
        "green": "#52ce60",
        "blue": "#6ea5f8",
        "lightred": "#fd8852",
        "lightblue": "#afd4fe",
        "lightgreen": "#b9e986",
        "pink": "#faadc1",
        "purple": "#d689ff",
        "orange": "#f08c00"
    }

      let ColorNames = [];
      for (let n in Colors) ColorNames.push(n);

      // a conversion function for translating general color names to specific colors
    const colorFunc = (colorname) => {
		let c = Colors[colorname];
		
        if (c) return c;
        return "gray";
    }
	const convertKeyImage = (key) => {
		//console.log(key);
		let node_by_key = diagram.findNodeForKey(key).data;
		if ( node_by_key.source !== undefined) {
			return node_by_key.source;
		}
		return "";
	  }
	 
    const initDiagram = () => {		

			window.addEventListener('beforeunload', (event) => {
				event.preventDefault();
				event.returnValue = '';
			});
		  
			const $ = go.GraphObject.make;
			// set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
			//let contextMenuDiv = document.getElementById("contextMenu");
			let myContextMenu = $(go.HTMLInfo, {
				show: showContextMenu(),
				hide: hideContextMenu()
			});

		diagram =
		$(go.Diagram,
		  {
			'undoManager.isEnabled': true,  
			'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
			  model: $(go.GraphLinksModel, {
				  linkKeyProperty: 'key'  
			  }),
			
			 
		  });

		

			diagram.contextMenu = myContextMenu;
		
			diagram.nodeTemplate =
			
				$(go.Node, "Auto", 
				{
					locationSpot: go.Spot.Center,
					resizable: true,
					resizeObjectName: "PH",
					isShadowed: true,
                	shadowColor: 'gray',
                	shadowOffset: new go.Point(2,2),
				},
				
				new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
				 // the whole node panel
				
					$(go.Shape, "RoundedRectangle", { name: "PH", strokeWidth: 0, fill: "white" },
						new go.Binding("fill", "color").makeTwoWay(),
						new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
						
						$(go.Panel, "Table",
						{ defaultAlignment: go.Spot.Left },
							$(go.Picture,  
								{ maxSize: new go.Size(50, 50), imageStretch: go.GraphObject.Uniform, column: 0, rowSpan: 2, margin: new go.Margin(0, 10, 0, 0), stretch: go.GraphObject.Vertical},
								new go.Binding("source", "key", convertKeyImage).makeTwoWay(go.Point.stringify)
							),
							$(go.TextBlock, {  column: 1,  margin: new go.Margin(0, 5, 0, 0)}, 
								new go.Binding("text", "text").makeTwoWay(), 
								new go.Binding("stroke", "color_font").makeTwoWay(),
								new go.Binding("scale", "scale").makeTwoWay(),
								new go.Binding("desc", "text").makeTwoWay(), 
								new go.Binding("font", "font").makeTwoWay(),
							),
							$(go.TextBlock, {  column: 1, row: 1,  margin: new go.Margin(0,10, 0, 0), overflow: go.TextBlock.OverflowEllipsis, maxLines: 2, width: 200,  wrap: go.TextBlock.WrapFit}, 
								new go.Binding("text", "desc").makeTwoWay(), 
								new go.Binding("stroke", "color_font").makeTwoWay(),
							),
						)
				);
			
			
					
			diagram.linkTemplate =
			$(go.Link,
			  { toShortLength: 3, relinkableFrom: true, relinkableTo: true,reshapable: true, curve: go.Link.Bezier },
			  new go.Binding("points").makeTwoWay(),  // allow the user to relink existing links
			  $(go.Shape,
				{ strokeWidth: 2 },
				new go.Binding("stroke", "color")),		  
			);
			
			//diagram.layout = $(ForceDirectedLayout);
			//console.log(DoubleTreeLayout);
			//diagram.layout = $(DoubleTreeLayout);
			
									
		
			diagram.addDiagramListener("ObjectSingleClicked", handleStickyContextmenu);
			diagram.addDiagramListener("BackgroundSingleClicked", handleStickyContextmenuBackgroundSingleClicked);
			diagram.addModelChangedListener( (evt) => {
				if (evt.isTransactionFinished) {
					console.log("isTransactionFinished");
					console.log(evt);
					//this.handleSaveMap();
				}
			});
			
			  
			  return diagram;
		
	}

	
	  
	  const handleModelChange = (changes) => {

		const currentMap = diagram.model.toJson();
		currentMapObject = JSON.parse(currentMap);
		console.log(currentMapObject);

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
			editSelectionNode();
		}
	}
	
	const saveEvent = (newNodeData) => {
		
		if(currentNode !== undefined && currentNode !== null  && currentNode.key !== undefined) {
			const data = diagram.model.findNodeDataForKey(currentNode.key);
			console.log(newNodeData);
			if (data) {
				diagram.model.startTransaction("modified property");
				diagram.model.set(data, "text", newNodeData.text);
				diagram.model.set(data, "desc", newNodeData.desc);
				diagram.model.set(data, "source", newNodeData.source);
				diagram.model.set(data, "location", newNodeData.location);
				diagram.model.set(data, "color", newNodeData.color);
				diagram.model.set(data, "color_font", newNodeData.color_font);
				
				diagram.model.commitTransaction("modified property");
				handleSaveMap();
				setEditorIsOpen(false);
				setCurrentNode(null);
				setContextIsOpen(false);
				if( newNodeData.source !== '' ) {
					let model_tmp = diagram.model.toJson();
					diagram.model = go.Model.fromJson(model_tmp);
				}
			}
		}
		
	}

	const handleDiagramEvent = (e) => {
		console.log("handleDiagramEvent",e);
	}


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
				<div className={classes.MindmapBuilder}>
					<ReactDiagram
						initDiagram={() => initDiagram()}
						divClassName={classes.DiagramComponent}
						nodeDataArray={nodeDataArray}
						linkDataArray={linkDataArray}
						onModelChange={(e) => handleModelChange(e)}
					/>
					<IonFab activated={contextIsOpen}  vertical="bottom" horizontal="end" slot="fixed">
						<IonFabButton color="medium" size="small">
							<IonIcon  icon={grid} />
						</IonFabButton>
						<IonFabList side="top">
							<IonFabButton className={classes.IonAdd} color="tertiary" onClick={() => addNodeAndLink() }>
								<IonIcon icon={addOutline} />
							</IonFabButton>
						</IonFabList>
						<IonFabList side="start">
							<IonFabButton color="light" onClick={joinSelectionNode}>
								<IonIcon icon={gitMerge} />
							</IonFabButton>
							<IonFabButton color="light" onClick={editSelectionNode}>
								<IonIcon icon={text} />
							</IonFabButton>
							<IonFabButton id="copy" color="light" onClick={copySelectionNode}>
								<IonIcon icon={copy} />
							</IonFabButton>
							{/* <IonFabButton color="light" onClick={pasteSelectionNode}>
								<IonIcon icon={clipboard} />
							</IonFabButton> */}
							<IonFabButton color="danger" onClick={() => deleteSelectionNode() }>
								<IonIcon icon={trash} />
							</IonFabButton>
						</IonFabList>
					</IonFab>
					<Editor enabled={editorIsOpen}
							selectedObject = {  currentNode }
							saveEvent = {saveEvent}>
					</Editor>

				</div>
			{/* <div className={classes.SavedMap}>
				<textarea defaultValue={this.state.currentMapModel} name="saved_map"></textarea>
			</div> 
			<SaveProject/>*/}
			

			</IonContent>
		</IonPage>
	)
}



// Rzutowanie globalnego state do props
const mapStateToProps = state => {
	
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