const axios = require('axios');
const { pterodactyl } = require('../config/config.js');

var globalNodes = null;

async function initializeNodes() {
    globalNodes = await getNodes();  // getNodes deve retornar um array de nós
}

// Get Nodes (Servers);
async function getNodes() {
    try {
        const res = await axios(pterodactyl.url + '/api/application/nodes?include=servers,location,allocations', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + pterodactyl.apiKey
            }
        });

        let nodes = res.data.data;

        if (!Array.isArray(nodes) || nodes.length === 0) {
            console.log('Nenhum nó encontrado.');
            return [];
        }

        const configPromises = nodes.map(node => getConfiguration(node.attributes.id));
        const allConfigs = await Promise.all(configPromises);

        for (let i = 0; i < nodes.length; i++) {
            nodes[i].config = allConfigs[i];
        }

        return nodes;
    } catch (err) {
        console.log({ msg: 'Problema com os Nodes do Pterodactyl.', err: err });
    }
}

// Get Configuration of the Node;
async function getConfiguration(id) {
    try {
        const res = await axios(pterodactyl.url + '/api/application/nodes/' + id + '/configuration', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + pterodactyl.apiKey
            }
        });
        return res.data;
    } catch (err) {
        console.log({ msg: 'Problema com as Configurações do Pterodactyl.', err: err });
        return null;
    }
}

// Get Server and need Node configuration Token;
async function getServers(node) {
    try {
        const res = await axios(node.attributes.scheme + '://' + node.attributes.fqdn + ':' + node.attributes.daemon_listen + '/api/servers', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + node.config.token
            }
        });
        const itemEncontrado = await res.data.find(item => item.configuration.meta.name === pterodactyl.serverName);
        return itemEncontrado || res.data[0];//{ server:res.data };
    } catch (err) {
        console.log({ msg: 'Problema com os Servers do Pterodactyl.', err: err });
        return null;
    }
}

// Inicializar os nós uma única vez
initializeNodes()
.catch(err => {
    console.error(err);
});

// Função main
async function serverStatus() {
    if (globalNodes && globalNodes.length > 0) {
        const serverPromises = globalNodes.map(node => getServers(node));
        const allServers = await Promise.all(serverPromises);

        return allServers;  // Isso deve imprimir um array com as informações dos servidores de cada nó
    } else {
        return []
    }
}

module.exports = { serverStatus };
