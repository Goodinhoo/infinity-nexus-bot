const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Lista todos os jogadores que estão online no momento.'),

    execute: async (client, interaction) => {
        try {
            axios.get('https://api.mcsrvstat.us/3/82.180.133.132:25565')
                .then(function (response) {
                    // Manipular a resposta bem-sucedida aqui
                    let data = response.data.players
                    if (!data) return;
                    const onlinePlayers = data.list.map(player => player.name).join(', ');
                    let embed = new Discord.EmbedBuilder()
                        .setColor(`Blue`)
                        .setTitle(`Online [${data.online}/${data.max}]`)
                        .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() })
                        .setDescription(`${onlinePlayers}`);
                    interaction.reply({ ephemeral: true, embeds: [embed] });
                })
        } catch (e) { // Catch Err
            interaction.channel.send({
                content: `Servidor não está online!`, ephemeral: true,
            });
        }
    }
};
