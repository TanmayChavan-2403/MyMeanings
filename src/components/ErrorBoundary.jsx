import React, { Component } from 'react';

class ErrorBoundary extends Component{
	constructor(props){
		super(props)
		this.state = {
			hasError: false,
			count: 1
		}
	}

	static getDerivedStateFromError(error){
	    // Update state so the next render will show the fallback UI.
	    return { hasError: true };
	}

	componentDidCatch(error, errorInfo){
    	sessionStorage.clear();
    	window.location.reload(true);
	}

	render(){
		const errorPage = {
			width: '100vw',
			height: '100vh',
			display: 'flex',
			flexWrap: 'wrap',
			alignContent: 'center',
			justifyContent: 'center',
			backgroundColor: 'var(--text)'
		}

		const errorImage = {
			width: '51%',
			height: '40%',
			display: 'flex',
			justifyContent: 'center',
			border: '1px solid white'
		}

		const errorText = {
			width: '51%',
			height: '20%',
			textAlign: 'center',
			border: '1px solid white',
		}

		const text = {
			fontWeight: '300',
			fontSize: '2rem',
			fontFamily: "'Montserrat', sans-serif"
		}

		if (this.state.hasError){
			return (
				<div style={errorPage}>
					<div style={errorImage}>
						<img src="./error.png" />
					</div>
					<div style={errorText}>
						<h1 style={text}> Please seat tight, while we are fixing error for you. </h1>
					</div>
				</div>
			)
		}

		return this.props.children
	}

}

export default ErrorBoundary