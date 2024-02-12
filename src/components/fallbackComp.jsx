import '../stylesheets/fallBackComp.css'

const Fallback = props => {
	const STYLES = {
		color: "white",
		display: 'flex',
		alignItems: "center",
		justifyContent: "center",
		width: "100%", height: "100%",
	}

	return(
		<div style={STYLES}>
			<h1> Loading please wait... </h1>
		</div>
	)
}

export const ServerError = ({message}) =>{
	return(
		<div id='error-container'>
			<div id='message'>
				<h1 id='oops'> OOPS! </h1>
				<div id='message-overlay'>
					<p id='error-message'>500 - {message.toUpperCase()}</p>
				</div>
			</div>
{/*			<div id='home-button'>
				<a href='https://myvocabspace.web.app/'>
					<button id='button'> Go to <strong id='s'> HOME </strong> page </button>	
				</a>
			</div>*/}
		</div>
	)
}

export default Fallback;