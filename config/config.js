module.exports = {
    // Bot Inf
    username: "Infinity Nexus", // Nome do Servidor (mine)
    ip: "infinitynexus.pro", // IP do Servidor (mine)
    TOKEN: "MTE0MzI3NTgwMjA5NjU3MDUyMQ.G_NDDt.TlUL7dMpcaJO_Aeqius38tCqmFLaZNbW1mbh_Y", // Bot Token
    mongodb: "mongodb+srv://nexus:MelhorServidor157@cluster0.fnrpfug.mongodb.net/nexus?retryWrites=true&w=majority", // MongoDB URL
    commandsDir: './commands', // Commands Folder
    embedColor: '',

    clientId: "1143275802096570521",
    guildId: "770774448336797696", // ID do Servidor
    delayPresence: 10000, // Discord Bot Status

    // Pterodactyl Settings
    pterodactyl: {
        url: "http://166.0.189.29", // Pterodactyl URL
        serverName: 'Infinity Nexus Reborn',
        apiKey: "ptlc_CtYo5HxvuKkt7Huu5fqhVhMv43loMKsVDoayH75LVRR", // Pterodactyl API Key
        refresh: 15, // Discord Timer Refresh
        serverID: '33f88c0d', // Pterodactyl Server ID
        clientKey: 'ptlc_CtYo5HxvuKkt7Huu5fqhVhMv43loMKsVDoayH75LVRR', // Pterodactyl Client Key
        serverStatus: "1147325946660135012", // Discord Channel ID
    },
    lojaSquare: {
        api: 'https://api.lojasquare.net/v1', // Url Api
        token: 'ZRUJiDOGxe0MAPKVKolWl73ce0ka3W', // Token Api Key
    },
    joinAndLeave: {
        welcome: '1145207232015900743',
        membersCount: '777708472992661505',
    }, // Welcome Channel ID

    music: {
        channelDJ: '1157014724316237914',
        maxVol: 150,
        voiceConfig: {
            leaveOnFinish: true, //If this variable is "true", the bot will leave the channel the music ends.
            leaveOnStop: true, //If this variable is "true", the bot will leave the channel when themusic is stopped.

            leaveOnEmpty: { //The leaveOnEnd variable must be "false" to use this system.
                status: true, //If this variable is "true", the bot will leave the channel when the bot is offline.
                cooldown: 10000000, //1000 = 1 second
            },
        },
    },
}