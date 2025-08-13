const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('post')
        .setDescription('Posta um embed personalizado')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('title')
                .setRequired(true)
                .setDescription('titulo do post'))
        .addStringOption(option =>
            option.setName('description')
                .setRequired(true)
                .setDescription('Descrição do post'))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Cor do post')
                .setRequired(true)
                .addChoices(
                    { name: 'azul-claro', value: 'azul-claro' },
                    { name: 'azul', value: 'azul' },
                    { name: 'verde-claro', value: 'informar' },
                    { name: 'vermelho-claro', value: 'vermelho-claro' },
                    { name: 'vermelho', value: 'vermelho' },
                    { name: 'vermelho-escuro', value: 'vermelho-escuro' },
                    { name: 'amarelo', value: 'amarelo' },
                    { name: 'roxo', value: 'roxo' },
                    { name: 'sim', value: 'sim' }
                ))
        .addStringOption(option =>
            option.setName('imagem')
                .setDescription('Imagem do post'))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Cargo para ser mencionado'))
        .addStringOption(option =>
            option.setName('content')
                .setDescription('Conteúdo do post')),

    execute: async (client, interaction) => {
        try {
            const title = interaction.options.getString("title");
            const descricao = interaction.options.getString("description").replace(/\\n/g, "\n");
            const colorGet = interaction.options.getString("color") || "azul-claro";
            const imagem = interaction.options.getString("imagem");
            const role = interaction.options.getRole("role");
            const content = interaction.options.getString("content");
            const colorNames = {
                'azul-claro': '#6ca8c1',
                'azul': 'Blue',
                'informar': '#98fb98',
                'vermelho-claro': '#f86c68',
                'vermelho-escuro': '#7f0407',
                'vermelho': '#FF0000',
                'amarelo': '#f8d91c',
                'roxo': '#7547a3',
                'sim': '#18acff'
            };
            if (colorNames.hasOwnProperty(colorGet)) {
                color = colorNames[colorGet];
            } else {
                color = "#ff00ff"
            }
            let embed = new Discord.EmbedBuilder()
                .setColor(`${color}`)
                .setAuthor({ name: `${interaction.user.globalName}`, iconURL: `${interaction.user.avatarURL()}` })
                .setTitle(`${title}`)
                .setFooter({ text: 'Atenciosamente equipe Nexus.', iconURL: client.user.avatarURL() })
                .setDescription(`${descricao}`);
            imagem ? embed.setImage(`${imagem}`) : null;
            interaction.channel.send({ embeds: [embed], content: (role ? `${role}` : null) + content ? `\n${content}` : null });
            interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true }).then(m => m.delete({ timeout: 5000 }).catch(e => { }))
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
    }
}