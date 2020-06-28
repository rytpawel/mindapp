// Library
import React, { Component } from 'react';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

// Components
import Wrap from '../../components/hoc/Wrap';


//Styles
import classes from './MindMapBuilder.module.css';

let diagram = null;

class MindMapBuilder extends Component {

	
	hideContextMenu = () => {
		let contextMenuDiv = document.getElementById("contextMenu");
		contextMenuDiv.style.display = "none";
	}

	hideCX = (myDiagram) => {
        if (myDiagram.currentTool instanceof go.ContextMenuTool) {
          myDiagram.currentTool.doCancel();
        }
	}
	maybeShowItem = (elt, pred, hasMenuItem) => {
		if (pred) {
		  elt.style.display = "block";
		  hasMenuItem = true;
		} else {
		  elt.style.display = "none";
		}
	}
	showContextMenu = (obj, diagram, tool) => {
		var cmd = diagram.commandHandler;
		var hasMenuItem = false;
		let contextMenuDiv = document.getElementById("contextMenu");

		contextMenuDiv.style.display = "block";
		contextMenuDiv.classList.add("show-menu");
		
		this.maybeShowItem(document.getElementById("remove"), cmd.canDeleteSelection(),hasMenuItem);
		this.maybeShowItem(document.getElementById("paste"), cmd.canPasteSelection(),hasMenuItem);
		this.maybeShowItem(document.getElementById("copy"), cmd.canCopySelection(),hasMenuItem);

		var mousePt = diagram.lastInput.viewPoint;
		contextMenuDiv.style.left = mousePt.x - 40 + "px";
		contextMenuDiv.style.top = mousePt.y - 30 + "px";
	}



	deleteSelectionNode = () => {
		diagram.commandHandler.deleteSelection();
	 	diagram.currentTool.stopTool();
	}
	pasteSelectionNode = () => {
		diagram.commandHandler.pasteSelection();
	 	diagram.currentTool.stopTool();
	}
	copySelectionNode = () => {
		diagram.commandHandler.copySelection();
	 	diagram.currentTool.stopTool();
	}
	addNode = () => {
		diagram.startTransaction("make new node");
  		diagram.model.addNodeData({ key: "Omega" });
		diagram.commitTransaction("make new node");
		
		diagram.currentTool.stopTool();

	}

	addNodeAndLink = (e, b) => {
		// take a button panel in an Adornment, get its Adornment, and then get its adorned Node
		var node = b.part.adornedPart;
		// we are modifying the model, so conduct a transaction
		var diagram = node.diagram;
		diagram.startTransaction("add node and link");
		// have the Model add the node data
		var newnode = { key: "N" };
		diagram.model.addNodeData(newnode);
		// locate the node initially where the parent node is
		diagram.findNodeForData(newnode).location = node.location;
		// and then add a link data connecting the original node with the new one
		var newlink = { from: node.data.key, to: newnode.key };
		diagram.model.addLinkData(newlink);
		// finish the transaction -- will automatically perform a layout
		diagram.commitTransaction("add node and link");
	  }
	
    initDiagram = () => {
	
        const $ = go.GraphObject.make;
		// set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
		let contextMenuDiv = document.getElementById("contextMenu");
		let myContextMenu = $(go.HTMLInfo, {
			show: this.showContextMenu,
			hide: this.hideContextMenu
		  });


        diagram =
          $(go.Diagram,
            {
              'undoManager.isEnabled': true,  // must be set to allow for model change listening
              // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
              'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
              model: $(go.GraphLinksModel,
                {
                  linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                })
			});
			
		diagram.contextMenu = myContextMenu;
		
		contextMenuDiv.addEventListener("contextmenu", function(e) {
			e.preventDefault();
			return false;
		  }, false);

        // define a simple Node template
        diagram.nodeTemplate =
		  $(go.Node, 'Auto', 
		  { contextMenu: myContextMenu },
		   // the Shape will go around the TextBlock
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, 'RoundedRectangle', { fill: "lightgray" }),
              
			  $(go.TextBlock,
				{ margin: 5 },
				new go.Binding("text", "key")),
			  {
				selectionAdornmentTemplate:
				  $(go.Adornment, "Spot",
					$(go.Panel, "Auto",
					  // this Adornment has a rectangular blue Shape around the selected node
					  $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
					  $(go.Placeholder)
					),
					// and this Adornment has a Button to the right of the selected node
					$("Button",
					  { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left,
						click: this.addNodeAndLink },  // define click behavior for Button in Adornment
					  $(go.TextBlock, "ADD",  // the Button content
						{ font: "bold 6pt sans-serif" })
					)
				  )  // end Adornment
			  }
			);
          diagram.linkTemplate =
                $(go.Link,
                    { curve: go.Link.Bezier },  // Bezier curve
                    $(go.Shape, { strokeWidth:2 }), // Grubość lini
					$(go.Shape, { toArrow: "Standard" }),
					
                    $(go.Panel, "Auto",  // this whole Panel is a link label
                       
                        $(go.TextBlock,
                        new go.Binding("text", "text"))
                    )
				);
				diagram.layout = $(go.TreeLayout);
        
        // diagram.nodeTemplate.contextMenu =
		// 	$("ContextMenu", "Spot",              // that has several buttons around
        //     $(go.Placeholder, { padding: 0 }),  // a Placeholder object
		// 		$("ContextMenuButton", $(go.TextBlock, "<div style='background-color:red;' id='test'>elo elo</div>"),
		// 		{ alignment: go.Spot.Top, alignmentFocus: go.Spot.Left, click: this.cmCommand }),
		// 		$("ContextMenuButton", $(go.TextBlock, "-"),
		// 		{ alignment: go.Spot.Top, alignmentFocus: go.Spot.Right, click: this.cmCommand }),
		// 		$("ContextMenuButton", $(go.TextBlock, "->"),
		// 		{ alignment: go.Spot.Top, alignmentFocus: go.Spot.Center, click: this.cmCommand })
				
		// 	);  // end Adornment
				            
        diagram.addDiagramListener("ObjectSingleClicked",
            function(e) {
              var part = e.subject.part;
              console.log(part.data);
              //if (!(part instanceof go.Link)) showMessage("Clicked on " + part.data.key);
            });
      
          
        
        return diagram;
    }
  
    handleModelChange = (changes) => {
        //console.log(changes);
        
	}
	cmCommand = (e) => {
		console.log(e);
	}
    handleDiagramEvent = () => {
        console.log("WORK");
    }
    
    

    render() {
        let nodeDataArray = 
        [
            { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
            { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
            { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
            { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
        ]
        let linkDataArray = 
        [
 
            { key: -2, from: 0, to: 2 },
            { key: -3, from: 0, to: 1 },
            { key: -4, from: 0, to: 3 },

        ]
        return (
            <Wrap>
                <div className={classes.MindmapBuilder}>
                <ReactDiagram
                    initDiagram={this.initDiagram}
                    divClassName={classes.DiagramComponent}
                    nodeDataArray={nodeDataArray}
                    linkDataArray={linkDataArray}
                    onDiagramEvent={this.handleDiagramEvent}
                    onModelChange={this.handleModelChange}
                    />
                    <div className={classes.ContextMenu} id="contextMenu">
						<ul>
							<li id="paste" onClick={this.pasteSelectionNode} className="menu-item">Paste</li>
							<li id="remove" onClick={this.deleteSelectionNode} className="menu-item">delete</li>
							<li id="copy" onClick={this.copySelectionNode} className="menu-item">copy</li>
							<li id="add" onClick={this.addNodeAndLink} className="menu-item">add</li>
						
						</ul>
						
					</div>
                </div>
            </Wrap>
            
        )
    }
}

export default MindMapBuilder;