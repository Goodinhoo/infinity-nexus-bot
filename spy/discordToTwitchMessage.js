const { twitchClient } = require('./loginTwitch.js');

function whiteInTwitch(channel, autor, cannal, message, self) {
    const autors = ['Reavik'];
    if (channel === '1285620375241232416') {
        if (self) return;
        if (autors.includes(autor)) {
            twitchClient.say('#' + cannal, message);
        }
    } else if (channel === '1172714937961959434') {
        const channels = {
            "!lu": "lucyjapinha",
            "!mo": "moldador",
            "!am": "amandinhalsls",
            "!bh": "bhaaskara",
            "!lo": "lobinhopelud",
            "!ga": "galvinoo",
            "!de": "deedobr",
            "!sa": "satooro",
            "!vu": "vulkanotg",
            "!py": "Pyixurr",
            "!re": "reavik",
            "!su": "sauletagames",
            "!gy": "gyanvt15",
            "!lr": "lordrebechi",
            "!ts": "tsdesert"
        };
        if (channels[cannal]) {
            
            if (autor === 'Reavik') {
                twitchClient.say(`#${channels[cannal.toLowerCase()]}`, `${message.slice(0, -1)}`);
            }
        }
    }
}

module.exports = whiteInTwitch;