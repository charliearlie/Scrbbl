import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import AppleMusicButton from '../components/AppleMusicButton';
import AlbumSearchResults from '../components/album/AlbumSearchResults';
import SnackbarContent from '../components/reusable/Snackbar/SnackbarContent';
import { search } from '../util/appleMusic';

const styles = () => ({
	container: {
		display: 'flex',
		height: '100vh',
	},
	card: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	resultCard: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		height: '80px',
		margin: '8px',
		alignItems: 'center',
		padding: '14px 40px',
		backgroundColor: '#fff',
	},
	input: {
		margin: '36px',
	},
	cssUnderline: {
		'&:after': {
			borderBottomColor: '#c3000d',
		},
	},
	appleMusicButton: {
		textTransform: 'none',
	},
	textInput: {
		width: '80%',
	},
	cssLabel: {
		'&$cssFocused': {
			color: '#c3000d',
		},
	},
	cssFocused: {},
	cssOutlinedInput: {
		'&$cssFocused $notchedOutline': {
			borderColor: '#c3000d',
		},
	},
	searchIcon: {
		fontSize: '18px',
	},
});

const inputSearchButtonStyles = {
	height: '54px',
	margin: '0',
	marginLeft: '-65px',
	boxShadow: 'none',
	background: 'transparent',
};
class AlbumScrobble extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchQuery: '',
			showSnackbar: false,
		};

		this.fillForm = this.fillForm.bind(this);
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
		this.handleScrobbleSuccess = this.handleScrobbleSuccess.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	fillForm(albums) {
		const albumList = albums.map(album => ({
			albumId: album.collectionId,
			artist: album.artistName,
			album: album.collectionName,
			albumArtwork: album.artworkUrl100,
			releaseYear: album.releaseDate.slice(0, 4) || '',
		}));

		this.setState({ searchResults: albumList });
	}

	async search() {
		const result = await search(this.state.searchQuery, 'album');
		this.fillForm(result);
	}

	async handleKeyPress(e) {
		if (e.key === 'Enter') {
			this.search();
		}
		return null;
	}

	handleChange(value, name) {
		this.setState({ [name]: value });
	}

	handleSnackbarClose() {
		this.setState({ showSnackbar: false });
	}

	handleScrobbleSuccess(snackbarMessage) {
		this.setState({ snackbarMessage, showSnackbar: true });
	}

	render() {
		const { classes } = this.props;
		return (
			<Fragment>
				<Grid item xs={false} lg={2} />
				<Grid item xs={12} lg={8}>
					<div className={classes.card} shadowLevel={1}>
						<TextField
							className={classes.textInput}
							InputLabelProps={{
								classes: {
									root: classes.cssLabel,
									focused: classes.cssFocused,
								},
							}}
							InputProps={{
								classes: {
									root: classes.cssOutlinedInput,
									focused: classes.cssFocused,
									notchedOutline: classes.notchedOutline,
								},
							}}
							label="Search for an album"
							variant="outlined"
							id="custom-css-outlined-input"
							placeholder="Search..."
							name="searchQuery"
							value={this.state.searchQuery}
							onKeyPress={this.handleKeyPress}
							onChange={e => this.handleChange(e.target.value, e.target.name)}
							autoFocus
						/>
						<AppleMusicButton
							query={this.state.searchQuery}
							fillForm={this.fillForm}
							type="album"
							variant="text"
							style={inputSearchButtonStyles}
						>
							<i className={`fas fa-search ${classes.searchIcon}`} />
						</AppleMusicButton>
					</div>
				</Grid>
				<Grid item xs={false} lg={2} />
				{this.state.searchResults && (
					<Fragment>
						Search Results
						<AlbumSearchResults
							results={this.state.searchResults}
							handleScrobbleSuccess={this.handleScrobbleSuccess}
						/>
					</Fragment>
				)}
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					open={this.state.showSnackbar}
					autoHideDuration={10000}
					onClose={this.handleSnackbarClose}
				>
					<SnackbarContent
						onClose={this.handleSnackbarClose}
						variant="success"
						message={this.state.snackbarMessage}
					/>
				</Snackbar>
			</Fragment>
		);
	}
}

export default withStyles(styles, { withTheme: true })(AlbumScrobble);
