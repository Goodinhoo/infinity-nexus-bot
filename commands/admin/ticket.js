const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Cria um Ticket.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    execute: async (client, interaction) => {
        try {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
                interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true })
            } else {
                let embed = new Discord.EmbedBuilder()
                    .setColor("#ff00ff")
                    .setAuthor({ name: '📫 Sistema de chamados' })
                    .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() })
                    .addFields({ name: '⏲ Horário de atendimento:', value: '`08:00 até 00:00 (UTC-3)`', inline: false })
                    .setDescription(`Olá, seja bem-vindo ao sistema de ticket da Infinty Nexus, abaixo algumas regras e funcionalidades!`
                        + `\n\nComo funciona o ticket? \nAbrir um ticket > Selecione abaixo qual setor podemos te ajudar melhor!\nExemplo: problemas dentro do servidor? abra o ticket (Problemas no server) e coloque o nome do servidor.\n\nAssim que gerar o canal, você pode já ir informando nossa equipe sobre sua dúvida para assim agilizar seu atendimento.`
                        + `📨\n\nRegras! ✍\n\n- Não abra ticket para pedir ajuda sobre outros mods/servidor\n- Não é permitido marcar a staff INTEIRA ao abrir o ticket\n- Caso o ticket fique aberto por mais de 12 horas. sem interação do player. ele será fechado\n- Abrir ticket em um setor e falar sobre assunto de outro setor`
                        + `\n\n**Avisos importantes**\n\nLembrando que é sempre bom evitar tickets sem fundamentos. duvidas que podem ser sanadas em chat geral ou dentro do chat do servidor.`
                        + `\n**Seus tickets ficam sempre salvos! para a sua e nossa segurança.**`);

                let painel = new Discord.ActionRowBuilder().addComponents(
                    new Discord.SelectMenuBuilder()
                        .setCustomId("painel_ticket")
                        .setPlaceholder("Faça uma seleção!")
                        .addOptions(
                            {
                                label: "📨 Suporte Geral",
                                description: "Dúvidas Gerais.",
                                value: "ticket-opc1"
                            },
                            {
                                label: "🛒 Financeiro",
                                description: "Fale com o Financeiro.",
                                value: "ticket-opc2"
                            },
                            {
                                label: "🐞 Report Bugs",
                                description: "Reporte Bugs.",
                                value: "ticket-opc3"
                            },
                            {
                                label: "🚫 Punições",
                                description: "Fale sobre Punições.",
                                value: "ticket-opc4"
                            }
                        )
                );

                interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true })
                interaction.channel.send({ embeds: [embed], components: [painel] })
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
    }
}