import React from 'react';
// Library
import * as SRD from "@projectstorm/react-diagrams";

const simpleDiagramWidget = (props) => (
     <SRD.DiagramWidget diagramEngine={props.engine} />
)
export default  simpleDiagramWidget