const lastfm = require('../routes/lastfm');
const moment = require('moment');

exports.manualScrobble = (req, res) => {
    const track = req.body;
	const status = { "success": false };
    let date = Math.floor((new Date()).getTime() / 1000) - 300;
    
	if (track.date) {
		const dateSplit = track.date.split('-');
		let formattedDate;
		if (track.time) {
			const splitTime = track.time.split(":");
			formattedDate = moment().set({ 
				day: dateSplit[2] - 1, 
				month: dateSplit[1] - 1, 
				year: dateSplit[0],
				hour: splitTime[0],
				minute: splitTime[1],
			}).format('X');
		} else {
			formattedDate = moment().set({ 
				day: dateSplit[2] - 1, 
				month: dateSplit[1] - 1, 
				year: dateSplit[0],
			}).format('X');
		}
		date = formattedDate;
	}
	
	console.log('DATE', date);
    
	lastfm.setSessionCredentials(track.userName, track.key); //Horrible hack until I sort sessions with this api
	lastfm.track.scrobble({
		'artist': track.artist,
		'track': track.songTitle,
		'timestamp': date,
		'album': track.albumTitle

	}, function (err, scrobbles) {
		if (err) {
			return console.log('We\'re in trouble', err);
			lastfm.setSessionCredentials(null, null);
			return res.json(status.success);
		}

		console.log('We have just scrobbled:', scrobbles);
		status.success = true;
		lastfm.setSessionCredentials(null, null);
		return res.json(status.success);
	});
}

exports.get = (req, res) => {
    res.json({ name: 'Facking egg'});
}