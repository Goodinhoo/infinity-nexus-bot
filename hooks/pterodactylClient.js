const { pterodactyl } = require("../config/config");
const axios = require('axios');

// stop, start, restart, kill
async function powerServer(command) {
    let cmd;
    switch (command) {
        case 'stop':
            cmd = 'stop';
            break;
        case 'start':
            cmd = 'start';
            break;
        case 'restart':
            cmd = 'restart';
            break;
        case 'kill':
            cmd = 'kill';
            break;
        default:
            cmd = 'start';
            break;
    }

    try {
        const res = await axios.post(pterodactyl.url + `/api/client/servers/${pterodactyl.serverID}/power`, {
            signal: cmd
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + pterodactyl.clientKey,
            }
        });
        return console.log(res.data);
    } catch (err) {
        console.log({ msg: 'Erro ao reiniciar o servidor.', err: err });
        return null;
    }
}

async function consoleServer(cmd) {
    try {
        const res = await axios.post(pterodactyl.url + `/api/client/servers/${pterodactyl.serverID}/command`, {
            command: cmd
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + pterodactyl.clientKey,
            }
        });
        return true;
    } catch (err) {
        console.log({ msg: 'Erro ao enviar pro servidor.', err: err });
        return false;
    }
}

module.exports = { consoleServer, powerServer };