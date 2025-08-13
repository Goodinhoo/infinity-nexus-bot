const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getrolesnotify')
        .setDescription('mensagem para pegar os cargos.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (client, interaction) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Cargos").setColor('Blue')
                .setDescription(`Para garantir que todos tenham a melhor experiência no nosso servidor Discord, criamos alguns cargos de notificação.`
                    + `\nAgora você pode escolher quais tipos de informações deseja receber. Basta reagir com o emoji correspondente abaixo para obter o cargo:\n`
                    + `\n:one: - **Anúncios**: Receba notificações importantes e anúncios essenciais.`
                    + `\n:two: - **Novidades**: Saiba das últimas novidades e eventos em primeira mão.`
                    + `\n:three: - **Promoções**: Esteja entre os primeiros a conhecer as ofertas e promoções especiais.`
                    + `\n:four: - **Status**: Receba notificações quando o servidor estiver online.`
                    + `\n\nLembrando que nós respeitamos aqueles que preferem não serem constantemente notificados. Se você não deseja receber essas notificações, sinta-se à vontade para não reagir as opções acima :wink:.`
                    + `\n\nObrigado por fazer parte da nossa comunidade!`)
            await interaction.channel.send({ embeds: [embed], ephemeral: false }).then(async (msg) => {
                await msg.react('1️⃣');
                await msg.react('2️⃣');
                await msg.react('3️⃣');
                await msg.react('4️⃣');
            });
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