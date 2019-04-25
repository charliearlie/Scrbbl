import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import RadioIcon from '@material-ui/icons/Radio';
import CollectionIcon from '@material-ui/icons/Collections';

const drawerItems = [
	{
		icon: <i className="fas fa-home" style={{ fontSize: '25px' }} />,
		text: 'Home',
		shortText: 'Home',
		route: '/',
	},
	{
		icon: <i className="fas fa-music" style={{ fontSize: '25px' }} />,
		text: 'Scrobble song',
		shortText: 'Song',
		route: '/manual',
	},
	{
		icon: <i className="fas fa-compact-disc" style={{ fontSize: '25px' }} />,
		text: 'Scrobble album',
		shortText: 'Album',
		route: '/album',
	},
	{
		icon: <i className="fas fa-broadcast-tower" style={{ fontSize: '25px' }} />,
		text: 'Scrobble from Radio',
		shortText: 'Radio',
		route: '/radio',
	},
];

export default drawerItems;
