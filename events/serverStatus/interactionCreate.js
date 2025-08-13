const { GuildMember, ModalBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonStyle, ChannelType, EmbedBuilder, ButtonBuilder, PermissionFlagsBits } = require('discord.js')

const transcript = require('discord-html-transcripts') // https://www.npmjs.com/package/discord-html-transcripts
const { powerServer, consoleServer } = require('../../hooks/pterodactylClient')
const { errorEmbed } = require('../../utils/embedMessages');

module.exports = async (client, interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'show-console') {
            if (interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
            const modal = new ModalBuilder()
                .setTitle('Send to Console')
                .setCustomId('use-console');

            const console = new TextInputBuilder()
                .setCustomId('command')
                .setRequired(true)
                .setLabel('🖥️ Server console input')
                .setPlaceholder('> Type a Command..')
                .setStyle(TextInputStyle.Short)

            const firstActionRow = new ActionRowBuilder().addComponents(console)

            modal.addComponents(firstActionRow);

            interaction.showModal(modal);
            } else {
                interaction.reply({ embeds: [errorEmbed('Somente membros confiáveis da equipe podem usar esses comandos!')], ephemeral: true });
            }
        }
        if (interaction.customId === "power-on" || interaction.customId === "power-off" || interaction.customId === "power-restart") {

            let customId; // Para armazenar o customId do modal

            switch (interaction.customId) {
                case 'power-on':
                    customId = 'power-on-accept';
                    break;
                case 'power-restart':
                    customId = 'power-restart-accept';
                    break;
                case 'power-off':
                    customId = 'power-off-accept';
                    break;
                default:
                    customId = 'power-on-accept';
            }

            if (interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                let action = interaction.customId == 'power-on' ? 'Ligar' : interaction.customId == 'power-restart' ? 'Reiniciar' : 'Desligar'

                const modal = new ModalBuilder()
                    .setTitle(`Power System ( ${action} )`)
                    .setCustomId(customId);

                const confirmation = new TextInputBuilder()
                    .setCustomId('power-confirmation')
                    .setRequired(true)
                    .setLabel('Você deseja realmente executar essa ação?')
                    .setPlaceholder('(sim/s/y/yes) para confirmar, qualquer coisa para cancelar.')
                    .setStyle(TextInputStyle.Short)

                const firstActionRow = new ActionRowBuilder().addComponents(confirmation)

                modal.addComponents(firstActionRow);

                interaction.showModal(modal);
            } else {
                interaction.reply({ embeds: [errorEmbed('Somente membros confiáveis da equipe podem usar esses comandos!')], ephemeral: true });
            }

        }
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId == 'use-console') {
            const command = interaction.fields.getTextInputValue('command');
            let verify = await consoleServer(command)
            if (verify) {
                interaction.reply({ content: "Comando enviado: ```" + command + "```", ephemeral: true })
            } else {
                interaction.reply({ content: "Erro ao enviar o comando: ```" + command + "```", ephemeral: true })
            }
        }
        if (interaction.customId.startsWith('power-')) {
            const confInput = interaction.fields.getTextInputValue('power-confirmation');

            let customId;
            switch (interaction.customId) {
                case 'power-on-accept':
                    customId = 'start';
                    break;
                case 'power-restart-accept':
                    customId = 'restart';
                    break;
                case 'power-off-accept':
                    customId = 'stop';
                    break;
                default:
                    customId = 'start';
            }

            if (confInput == 's' || confInput == 'sim' || confInput == 'y' || confInput == 'yes') {
                interaction.reply({ content: `✅ ${interaction.user}, ação confirmada.`, ephemeral: true })
                powerServer(customId);
            } else {
                interaction.reply({ content: `❌ ${interaction.user}, ação cancelada.`, ephemeral: true })
            }
        }
    }
}