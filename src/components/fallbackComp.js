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

export default Fallback;