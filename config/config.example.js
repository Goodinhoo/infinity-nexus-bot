module.exports = {
    // Bot Info
    username: "NomeDoServidor", // Nome do Servidor (mine)
    ip: "ipdoservidor.com", // IP do Servidor (mine)
    TOKEN: "SeuTokenDoBotAqui", // Bot Token
    commandsDir: './commands', // Pasta de Comandos
    embedColor: '#000000', // Cor para Embeds

    clientId: "SeuIDDoClienteAqui",
    guildId: "IDDoServidorAqui", // ID do Servidor
    delayPresence: 10000, // Intervalo para atualização do status do Discord Bot

    // Configurações do Pterodactyl
    pterodactyl: {
        url: "http://suaurlpterodactyl.com", // URL do Pterodactyl
        serverName: 'Nome do Servidor Pterodactyl',
        apiKey: "SuaChaveAPIPterodactylAqui", // Chave da API do Pterodactyl
        refresh: 15, // Intervalo para atualização no Discord
        serverID: 'IDDoServidorPterodactylAqui', // ID do Servidor Pterodactyl
        clientKey: 'ChaveDoClientePterodactylAqui', // Chave do Cliente Pterodactyl
        serverStatus: "IDDoCanalDoDiscordParaStatusAqui", // ID do Canal do Discord para o status
    },
    lojaSquare: {
        api: 'https://api.lojasquare.net/v1', // URL da API da Loja Square
        token: 'SuaTokenDaAPIAqui', // Token da API da Loja Square
    },
}
