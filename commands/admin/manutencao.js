const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { consoleServer, powerServer } = require('../../hooks/pterodactylClient');

var player;
var timer;

const messages = [
    { mensagem: `broadcast &aO servidor entrará em manutenção em 5 minutos! &bMotivo: %motivo%`, tempo: 2 * 60 * 1000 },
    { mensagem: `broadcast &aO servidor entrará em manutenção em 3 minutos! &bMotivo: %motivo%`, tempo: 2 * 60 * 1000 },
    { mensagem: `broadcast &aO servidor entrará em manutenção em 1 minuto, deslogue para evitar perdas!`, tempo: 30 * 1000 },
    { mensagem: `broadcast &aO servidor entrará em manutenção em 30 segundos!`, tempo: 20 * 1000 },
    { mensagem: `broadcast &aO servidor entrará em manutenção em 10 segundos!`, tempo: 5 * 1000 },
    { mensagem: `broadcast &aO servidor entrará em manutenção em 5 segundos!`, tempo: 1 * 1000 },
    { mensagem: `broadcast &aO servidor entrará em manutenção em 4 segundos!`, tempo: 1 * 1000 },
    { mensagem: `broadcast &aO servidor entrará em manutenção em 3 segundos!`, tempo: 1 * 1000 },
    { mensagem: `broadcast &aO servidor entrará em manutenção em 2 segundos!`, tempo: 1 * 1000 },
    { mensagem: `broadcast &aO servidor entrará em manutenção em 1 segundo!`, tempo: 1 * 1000 },
    { mensagem: `broadcast &aO servidor será reiniciado!`, tempo: 2 * 1000 },
    { mensagem: `kick all &7[&dInfinity Nexus&7] \\n\\n&aO servidor está entrando em manutenção! \\n\\n&aRazão: %motivo%\\n\\n&6Entre no nosso Discord para saber mais: &dhttps://discord.gg/3gDrregs5n`, tempo: 5 * 1000 },
    { mensagem: `whitelist on`, tempo: 2 * 1000 },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manutencao')
        .setDescription('Coloca o servidor em manutenção.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('option')
                .setDescription('Start or Stop manuntenção system')
                .setRequired(true)
                .addChoices(
                    { name: 'start', value: 'start' },
                    { name: 'stop', value: 'stop' },
                ))

        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Descrição do post')),
    execute: async (client, interaction) => {
        try {
            // Pegar variables
            const option = interaction.options.getString("option"); // start / stop
            const motivo = interaction.options.getString("motivo") || 'Não foi especificado!';

            // Função Recursiva
            function ReloadSystem(idx, motivo) {
                let item = messages[idx];
                // Use command on console
                if (!item) return;
                if (item.mensagem == 'restart') {
                    console.log('Restarting server...');
                    timer = null;
                    player = null;
                    powerServer('restart')
                    return;
                } else {
                    consoleServer(item.mensagem.replace(/%motivo%/g, motivo))
                    // intervalo
                    timer = setTimeout(() => {
                        ReloadSystem(idx + 1, motivo);
                    }, item.tempo);
                }
            }

            function stopReload() {
                clearInterval(timer);
                timer = null;
                player = null;
                console.log("Reload system stoped.");
            }

            if (option == 'start') {
                if (timer) return interaction.reply({ content: `O servidor já está em processo de manutenção!\nfoi por: <@${player}>`, ephemeral: true });
                interaction.reply({ content: `O servidor foi colocado em manutenção!\n**motivo:** ${motivo}`, ephemeral: true })
                player = interaction.user.id;
                ReloadSystem(0, motivo)
            } else {
                if (player) {
                    if (player !== interaction.user.id) return interaction.reply({ content: `Só quem fez o pedido pode parar!\nFeito por: <@${player}>`, ephemeral: true })
                }
                consoleServer('broadcast &aO servidor não vai mais entrar em manutenção!');
                interaction.reply({ content: `O Sistema de manutenção, foi desligado!`, ephemeral: true })
                stopReload();
            }
        } catch (e) {
            if (client.errorLog) {
                let embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTimestamp()
                    .addFields([
                        { name: "Command", value: `${interaction?.commandName}` },
                        { name: "Error", value: `${e.stack}` },
                        { name: "User", value: `${interaction?.user?.tag} \`(${interaction?.user?.id})\``, inline: true },
                        { name: "Guild", value: `${interaction?.guild?.name} \`(${interaction?.guild?.id})\``, inline: true },
                        { name: "Time", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
                        { name: "Command Usage Channel", value: `${interaction?.channel?.name} \`(${interaction?.channel?.id})\``, inline: true },
                        { name: "User Voice Channel", value: `${interaction?.member?.voice?.channel?.name} \`(${interaction?.member?.voice?.channel?.id})\``, inline: true },
                    ])
                await client.errorLog.send({ embeds: [embed] }).catch(e => { })
            } else {
                console.log(`
      Command: ${interaction?.commandName}
      Error: ${e}
      User: ${interaction?.user?.tag} (${interaction?.user?.id})
      Guild: ${interaction?.guild?.name} (${interaction?.guild?.id})
      Command Usage Channel: ${interaction?.channel?.name} (${interaction?.channel?.id})
      User Voice Channel: ${interaction?.member?.voice?.channel?.name} (${interaction?.member?.voice?.channel?.id})
      `)
            }
            return interaction.reply({ content: `Por favor tente esse comando novamente mais tarde. Possível bug reportado para os desenvolvedores.\n\`${e}\``, ephemeral: true }).catch(e => { })
        }
    },
};