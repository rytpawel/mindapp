import React, { Component } from 'react';

//Library
import {Route, Switch} from 'react-router-dom';

// Container
import LoginPage from './container/LoginPage/LoginPage';
import MindMapBuilder from './container/MindMapBuilder/MindMapBuilder';
import AllProjectsPage from './container/AllProjectsPage/AllProjectsPage';
// Components
import Layout from './components/Layout/Layout';




class App extends Component {

	render () {
		return (
			<div>
				<Layout>
					<Switch>
						<Route path="/my-projects" component={AllProjectsPage} />
						<Route path="/login" component={LoginPage} />
						<Route path="/" exact component={MindMapBuilder} />
					</Switch>
				</Layout>
			</div>
		);
	}
 
}

export default App;