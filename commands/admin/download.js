const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('download')
        .setDescription('Msg personalizada, ignora isso aqui.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('link')
                .setRequired(true)
                .setDescription('Link de download')),

    execute: async (client, interaction) => {
        const link = interaction.options.getString("link");

        const channelId = '1152778292861075506';
        const channel = client.channels.cache.get(channelId);

        let messages = await channel.messages.fetch({ limit: 10 }).then(msg => msg.filter(m => m.author.id === client.user.id).last())
        if (messages && messages.embeds.length < 1) {
            messages.delete()
            messages = null
        }

        let content = `**Download do Modpack **\n\nIP: infinitynexus.com.br\n\nVersão: 1.18.2\nForge: 40.2.10`+
        `\n\n- [CurseForge](https://legacy.curseforge.com/minecraft/modpacks/infinity-nexus-official)`+
        `\n- [Technic Launcher](https://www.technicpack.net/modpack/infinity-nexus-official.1974661)`+
        `\n- [Instalação Manual](${link})`
        +`\n\n|| @everyone ||`

        if (!messages) channel.send({ content: content })
        else messages.edit({ content: content })

        interaction.reply({ content: 'Download enviado!', ephemeral: true });
    }
}