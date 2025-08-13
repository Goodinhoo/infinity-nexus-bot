const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');

const { playerController } = require('../hooks/PlayerController.js');

module.exports = async (client) => {
    var servidores = client.guilds.cache.size;
    console.log(`Conectado ao Discord! servidores: ` + servidores);

    playerController(client);

    const commands = [];
    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                console.log('Comando ' + command.data.name + ' Atualizado')
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    const rest = new REST().setToken(client.config.TOKEN);

    (async () => {
        try {
            await console.log(`Started refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            await console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();

    console.log(client.user.username + ' conectado com sucesso.');
    //listChannels();
    try {
        client.user.setActivity({ "details": "24H", "state": "Minecraft", "name": `Inicializando a inicialização inicial.`, 'type': 2, 'url': "https://infinitynexus.lojasquare.net/" });
        client.user.s
        setInterval(() => {
            let math = Math.floor(Math.random() * 5 - 0);

            if (math = 0) { client.user.setActivity({ "details": "24H", "state": "Minecraft", "name": `Sugestões`, 'type': 1, 'url': "https://infinitynexus.lojasquare.net/" }); }
            if (math = 1) { client.user.setActivity({ "details": "24H", "state": "Minecraft", "name": `O status do Servidor`, 'type': 3, 'url': "https://infinitynexus.lojasquare.net/" }); }
            if (math = 2) { client.user.setActivity({ "details": "24H", "state": "Minecraft", "name": `Zerar o Draconic`, 'type': 5, 'url': "https://infinitynexus.lojasquare.net/" }); }
            if (math = 3) { client.user.setActivity({ "details": "24H", "state": "Minecraft", "name": `Digite !ip, !loja, !server`, 'type': 2, 'url': "https://infinitynexus.lojasquare.net/" }); }
            if (math = 4) { client.user.setActivity({ "details": "24H", "state": "Minecraft", "name": `Infinity Nexus`, 'type': 2, 'url': "https://infinitynexus.lojasquare.net/" }); }
        }, client.config.delayPresence);
    } catch (error) { return console.log(error); }
};

// Function
async function listChannels() {
    try {
        const guilds = client.guilds.cache;
        let geral = null;

        console.log('-------------------------');
        for (const guild of guilds) {
            var ct = 0;
            var cv = 0;
            const [guildId, guildObject] = guild;
            await guildObject.channels.fetch();

            console.log(`Servidor: ${guildObject.name} - ID: ${guildId}`);
            guildObject.channels.cache.each(channel => {
                if (channel.type === 0) {
                    //console.log(`${channel.name} - ${channel.id}`);
                    ct++;
                }
            });
            console.log('Canais de texto: ' + ct);

            guildObject.channels.cache.each(channel => {
                if (channel.type === 2) {
                    //console.log(`${channel.name} - ${channel.id}`);
                    if (channel.name.toLowerCase().includes('geral')) {
                        geral = channel;
                    }
                    cv++;
                }
            });
            console.log('Canais de voz: ' + cv);
            try {
                //joinVoiceChannel({
                //    channelId: geral.id,
                //    guildId: geral.guildId,
                //    adapterCreator: geral.guild.voiceAdapterCreator,
                //});
                console.log("Sucesso, conectado ao canal Geral do servidor " + guildObject.name);
            } catch (error) {
                console.log("Erro ao conectar-se ao canal Geral do servidor " + guildObject.name);
            }
            console.log('-------------------------');
        }
    } catch (error) {
        console.error('Erro ao listar os canais:', error);
    }
    return;
}
