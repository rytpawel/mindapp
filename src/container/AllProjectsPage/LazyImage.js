import React, { Component } from 'react';
export default class LazyImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            error: false
        };
    }

    componentDidMount() {
        const img = new Image();
        img.onload = () => {
            this.setState({
                loaded: true,
                error: false
            });
        };

        img.onerror = () => {
            this.setState({
                loaded: false,
                error: true
            });
        };

        img.src = this.props.src;
    }

    componentWillUpdate () {
        if( this.state.error && !this.state.loaded ) {
            const img = new Image();
            img.src = this.props.src;
            console.log('componentWillUpdate')
        }
    }
    

    render() {
        if (this.state.error || ! this.state.loaded ) {
            console.log('tutaj1');
            return <img className={this.props.className} style={this.props.style} src={this.props.unloadedSrc} alt={this.props.alt} />
        } else {
            console.log('tutaj2');
            return <img className={this.props.className} style={this.props.style} src={this.props.src} alt={this.props.alt} />
        }
    }
}