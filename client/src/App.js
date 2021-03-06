import React, { Suspense, lazy, useState, useEffect } from 'react';
import classNames from 'classnames';
import qs from 'qs';
import axios from 'axios';
import { Route, Redirect } from 'react-router-dom';

// Material UI components
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';

// App components
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import DrawerItems from './assets/DrawerItems';
import UserNav from './components/UserNav';
import SnackbarContent from './components/reusable/Snackbar/SnackbarContent';
import SideDrawerList from './components/SideDrawerList';
import MediaQuery, { Devices } from './components/reusable/MediaQuery';
import BottomNav from './components/BottomNav/BottomNav';

// Hooks
import useLocalStorage from './hooks/useLocalStorage';

// Pages
const ManualScrobble = lazy(() => import('./components/ManualScrobble'));
const AlbumScrobble = lazy(() => import('./pages/AlbumScrobble'));
const RadioScrobble = lazy(() => import('./pages/RadioScrobble'));
const AlbumADay = lazy(() => import('./pages/AlbumADay'));

const drawerWidth = 280;

const styles = theme => ({
	root: {
		flexGrow: 1,
		zIndex: 1,
		overflow: 'hidden',
		position: 'relative',
		display: 'flex',
		minHeight: '100vh',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		backgroundColor: '#c3000d',
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	title: {
		margin: '0',
		'@media (min-width: 1024px)': {
			marginLeft: '280px',
		},
	},
	footer: {
		position: 'fixed',
		height: '50px',
		bottom: '0px',
		left: '0px',
		right: '0px',
		marginBottom: '0px',
		boxShadow: '0px -2px 8px 0px rgba(0,0,0,0.10)',
	},
	hide: {
		display: 'none',
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: 0,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing.unit * 9,
		},
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: '24px',
		backgroundColor: theme.palette.background.default,
	},
});

function App(props) {
	const [displayName, setDisplayName] = useLocalStorage('ScrbblUser', '');
	const [open, toggleDrawer] = useState(false);
	const [showSnackbar, toggleSnackbar] = useState(false);

	useEffect(() => {
		const params = qs.parse(window.location.search.slice(1));
		if (params.token && !displayName) {
			axios
				.get(`/api/users/session/${params.token}`)
				.then(response => {
					setDisplayName('ScrbblUser', response.data.username);
					window.localStorage.setItem('ScrbblKey', response.data.key);
					setDisplayName(response.data.username);
					toggleSnackbar(true);
				})
				.catch(error => {
					throw new Error(error);
				});
		}
	}, []);

	const handleSnackbarClose = () => {
		toggleSnackbar(false);
	};

	/* eslint-disable */
	const login = () => {
		const callbackUrl = window.location.href.split('?')[0];
		const requestUrl =
			'http://www.last.fm/api/auth/?api_key=5e51b3c171721101d22f4101dd227f66&cb=' +
			callbackUrl;
		return (window.location.href = requestUrl);
	};

	const { classes } = props;
	return (
		<div className={classes.root}>
			<AppBar
				position="fixed"
				className={classNames(classes.appBar, open && classes.appBarShift)}
			>
				<Toolbar disableGutters={!open}>
					<div style={{ display: 'flex', margin: 'auto' }}>
						<h2 className={classes.title}>
							Scrbbl <i style={{ marginTop: '4px' }} className="fab fa-lastfm" />
						</h2>
					</div>
					<UserNav displayName={displayName} />
				</Toolbar>
			</AppBar>
			<MediaQuery>
				{device => {
					if (device === Devices.desktop) {
						return (
							<Drawer
								variant="permanent"
								classes={{
									paper: classNames(classes.drawerPaper),
								}}
								open={open}
							>
								<div className={classes.toolbar} />
								<Divider />
								<SideDrawerList
									closeDrawer={() => toggleDrawer(false)}
									items={DrawerItems}
								/>
								<Divider />
							</Drawer>
						);
					}
				}}
			</MediaQuery>

			{/* App body */}
			<main className={classes.content}>
				<div className={classes.toolbar} />
				{window.localStorage.getItem('ScrbblUser') ? (
					<Grid container spacing={24}>
						<Suspense fallback={<div>Loading...</div>}>
							<Route exact path="/" component={Home} />
							<Route path="/manual" component={ManualScrobble} />
							<Route path="/album" component={AlbumScrobble} />
							<Route path="/radio" component={RadioScrobble} />
							<Route path="/album-a-day" component={AlbumADay} />
							<Route
								path="/callback"
								render={() => <Redirect to={{ pathname: '/' }} />}
							/>
						</Suspense>
					</Grid>
				) : (
					<Login authenticate={login} />
				)}
				<MediaQuery>
					{device => {
						if (device !== Devices.desktop) {
							return <BottomNav items={DrawerItems} styles={classes.footer} />;
						}
					}}
				</MediaQuery>
			</main>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={showSnackbar}
				autoHideDuration={5000}
				onClose={handleSnackbarClose}
			>
				<SnackbarContent
					onClose={handleSnackbarClose}
					variant="success"
					message="Logged in successfully"
				/>
			</Snackbar>
		</div>
	);
}

export default withStyles(styles, { withTheme: true })(App);
