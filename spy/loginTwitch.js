const tmi = require('tmi.js');
const config = require('./config/config.json');
const whiteInDiscord = require('./twitchToDiscordMessage.js');
const moderateBots = require('./twitchModerateBots.js');

const twitchClient = new tmi.Client({
	options: { debug: true },
	identity: {
		username: config.twitch.TWITCH_NAME,
		password: config.twitch.TWITCH_TOKEN
	},
	channels: [ 
		"lucyjapinha",
		"moldador",
		"amandinhalsls",
		"lobinhopelud",
		"galvinoo",
		"bhaaskara",
		"sauletagames",
		"barbasirius",
		"arondesu0",
		"lordrebechi",
		"tsdesert"
	]
});
twitchClient.connect();

twitchClient.on('connected', (address, port) => {
	
})
twitchClient.on('message', (channel, tags, message, self) => {
	whiteInDiscord(channel, tags, message, self);
	if(!tags.mod && !tags.turbo && !tags.bits && !tags.subscriber) {
		moderateBots(channel, tags, message, self);
	}
});
module.exports = {twitchClient}