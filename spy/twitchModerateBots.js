const { twitchClient } = require('./loginTwitch.js');
const blacklist = [
    "10 espectadores grátis para você",
    "Cheap viewers ",
    "Best viewers ",
]
function moderateBots(channel, tags, message, self) {
    if (self) return;
    if (blacklist.some(word => message.toLowerCase().includes(word))) {
        twitchClient.say(channel, tags.username + " some daqui meu, traz nem um café.");
        try {
            twitchClient.timeout(channel, tags.username, 300);
        } catch (error) {
            console.log(error);
        }
        //twitchClient.timeout(channel, tags.username, 300);
        return;
    }
}

module.exports = moderateBots;