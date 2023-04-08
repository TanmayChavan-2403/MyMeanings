function Preloader(){
	const styles = {
		width: '100vw',
		height: "100vh",
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'var(--text)'
	}

	const preloader = {
		width: '10%',
		height: "10%",
		objectFit: 'contain'
	}

	return(
		<div style={styles}>
			<img style = {preloader} src="preloader.gif" alt='Loading ...' />
		</div>
	)
}

export default Preloader;