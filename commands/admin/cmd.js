const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { consoleServer } = require('../../hooks/pterodactylClient.js');

const { inspect } = require("util");
function toObject(obj) {
    const options = {
        depth: 1, // Define a profundidade máxima da inspeção
        compact: true, // Suprime a saída de objetos muito grandes
        breakLength: Infinity // Suprime a quebra de linha na saída
    };

    return (inspect(obj, options));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cmd')
        .setDescription('Apenas para os Desenvolvedores..')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Type the message to execute. ( only by Admininstrators )')
                .setRequired(true)
        ),

    execute: async (client, interaction) => {
        let command = interaction.options.getString("command")

        try {
            let verify = await consoleServer(command)
            if(verify) {
            interaction.reply({ content: "Comando enviado: ```" + command + "```", ephemeral: true })
            } else {
                interaction.reply({ content: "Erro ao enviar o comando: ```" + command + "```", ephemeral: true })
            }
        } catch (e) { // Catch Err
            interaction.channel.send({
                content: `An error occurred : \`${e.message}\``
            });
        }
    }
};
