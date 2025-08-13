const discordClient = require('./loginDiscord.js'); // O cliente do Discord já inicializado
const channelLogId = '1285620375241232416'; // O ID do canal do Discord
const guildLogId = '770774448336797696'; // O ID da guilda

function whiteInDiscord(channel, tags, message, self) {
    if (self) return;
    // Espera até que o cliente esteja pronto para evitar problemas de inicialização
    if (!discordClient.isReady()) {
        console.error('O cliente do Discord ainda não está pronto.');
        return;
    }

    // Acessa a guilda pelo ID
    const guild = discordClient.guilds.cache.get(guildLogId);
    if (!guild) {
        console.error('Guild não encontrada!');
        return;
    }

    // Acessa o canal dentro da guilda
    const discordChannel = guild.channels.cache.get(channelLogId);
    if (!discordChannel) {
        console.error('Canal do Discord não encontrado!');
        return;
    }

    // Formata a mensagem com o nome do usuário da Twitch e a mensagem enviada
    const discordMessage = `${message}`;
    const replaceReavik = discordMessage.replace(/Reavik/gi, '<@131907612529786880>');
    const replaceReavik2 = replaceReavik.replace(/Ravik/gi, '<@131907612529786880>');
    //const replaceGoodinho = replaceReavik2.replace(/Goodinhoo/gi, '<@357199995902099456>');
    //const replaceGoodinhoo2 = replaceGoodinho.replace(/godinho/gi, '<@357199995902099456>');
    //const replacePlayer = replaceGoodinhoo2.replace(/player/gi, '<@284002939587133440>');
    //const replacePlayer2 = replacePlayer.replace(/player_rs/gi, '<@284002939587133440>');

    // Envia a mensagem para o canal do Discord
    discordChannel.send(`> [**${channel.replace('#', '')}**]\`${tags['display-name']}\`: ${replaceReavik2}`)
        .then()
        .catch(console.error);

}

module.exports = whiteInDiscord;
