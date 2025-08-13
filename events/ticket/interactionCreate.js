const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonStyle, ChannelType, EmbedBuilder, ButtonBuilder, PermissionFlagsBits } = require('discord.js')

// Função para extrair o número após o último "-"
function extrairNumero(string) {
    // Divida a string com base no caractere "-"
    var partes = string.split("-");

    // Pegue o último elemento do array resultante
    var ultimoElemento = partes[partes.length - 1];

    // Converta o último elemento em um número
    var numero = parseInt(ultimoElemento);

    return numero;
}

const db = require('../../data/database');
const url = 'https://infinitynexus.com.br/ticket/'

const transcript = require('discord-html-transcripts') // https://www.npmjs.com/package/discord-html-transcripts
module.exports = async (client, interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith('ticket-star')) {
            const partes = interaction.customId.split("-");
            const star = partes[2]; // Para obter o "1"
            const ticketId = partes[3]; // Para obter "${ticket.id}"

            await db.Tickets.updateOne({ _id: ticketId }, { $set: { stars: star } })

            const component2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Claim')
                        .setEmoji('📄')
                        .setLabel('Ver Transcript')
                        .setURL(`${url}${ticketId}`)
                        .setStyle(ButtonStyle.Link)
                )

            interaction.update({ components: [] });
            interaction.channel.send("Obrigado pela sua avaliação!");

        }
        if (interaction.customId === "claim-ticket") {
            try {
                const canalTranscript = interaction.channel // Canal que será feito o transcript

                let texto = canalTranscript.topic;
                let matches = texto.match(/(\w+):\s*"([^"]+)"/g);

                let keyValuePairs = {};
                if (matches) {
                    matches.forEach(function (match) {
                        let parts = match.match(/(\w+):\s*"([^"]+)"/);
                        if (parts && parts.length === 3) {
                            let key = parts[1];
                            let value = parts[2];
                            keyValuePairs[key] = value;
                        }
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('Ticket Reivindicado')
                    .setDescription(`O seu ticket será atendido por ${interaction.user}`)
                    .setFooter({ text: `Atenciosamente Infinity Nexus`, iconURL: client.user.displayAvatarURL() });

                await db.Tickets.updateOne({ _id: keyValuePairs.id }, { $set: { claimed: interaction.user.id } });
                interaction.reply({ embeds: [embed] });
            } catch (err) {
                interaction.reply({ content: `Error: ${err}`, ephemeral: false });
            }
        }

        if (interaction.customId === "close-ticket") {
            const canalTranscript = interaction.channel // Canal que será feito o transcript

            const transcriptString = await transcript.createTranscript(canalTranscript,
                {
                    limit: -1, // Quantidade máxima de mensagens a serem buscadas. `-1` busca recursivamente.
                    returnType: 'string', // Opções válidas: 'buffer' | 'string' | 'attachment' Padrão: 'attachment' OU use o enum ExportReturnType
                    filename: `${canalTranscript.name}.html`, // Válido apenas com returnType é 'attachment'. Nome do anexo.
                    saveImages: true, // Baixe todas as imagens e inclua os dados da imagem no HTML (permite a visualização da imagem mesmo depois de deletada) (! VAI AUMENTAR O TAMANHO DO ARQUIVO!)
                    footerText: 'Foram exportadas {number} mensagen{s}!', // Altere o texto no rodapé, não se esqueça de colocar {number} para mostrar quantas mensagens foram exportadas e {s} para plural
                    poweredBy: true // Se deve incluir o rodapé "Powered by discord-html-transcripts"
                })
            const attachment = await transcript.createTranscript(canalTranscript,
                {
                    limit: -1, // Quantidade máxima de mensagens a serem buscadas. `-1` busca recursivamente.
                    returnType: 'attachment', // Opções válidas: 'buffer' | 'string' | 'attachment' Padrão: 'attachment' OU use o enum ExportReturnType
                    filename: `${canalTranscript.name}.html`, // Válido apenas com returnType é 'attachment'. Nome do anexo.
                    saveImages: true, // Baixe todas as imagens e inclua os dados da imagem no HTML (permite a visualização da imagem mesmo depois de deletada) (! VAI AUMENTAR O TAMANHO DO ARQUIVO!)
                    footerText: 'Foram exportadas {number} mensagen{s}!', // Altere o texto no rodapé, não se esqueça de colocar {number} para mostrar quantas mensagens foram exportadas e {s} para plural
                    poweredBy: true // Se deve incluir o rodapé "Powered by discord-html-transcripts"
                })

            // Channel of Transcripts
            const channel = await interaction.guild.channels.cache.get('1146617504798605353')
            if (!channel) return;
            // Get Channel Topic Info
            let texto = canalTranscript.topic;
            let matches = texto.match(/(\w+):\s*"([^"]+)"/g);

            let keyValuePairs = {};
            if (matches) {
                matches.forEach(function (match) {
                    let parts = match.match(/(\w+):\s*"([^"]+)"/);
                    if (parts && parts.length === 3) {
                        let key = parts[1];
                        let value = parts[2];
                        keyValuePairs[key] = value;
                    }
                });
            }
            // = { id, user, nickname, motivo}
            // Get User by ID
            let ticket = await db.Tickets.findOne({ _id: keyValuePairs.id });
            let user = await client.users.cache.get(ticket.user);
            let userTimestamp = new Date(ticket.data);

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(canalTranscript.name)
                .addFields({ name: '<:id:1164262833958162453> Ticket ID', value: ticket.id || "Não alocado.", inline: true })
                .addFields({ name: '<:open:1164262870016598196> Aberto por', value: `<@${user.id}>` || "Não alocado.", inline: true })
                .addFields({ name: '<:close:1164262872633847919> Fechado por', value: `<@${interaction.user.id}>` || "Não alocado.", inline: true })
                .addFields({ name: '<:claim:1164262877033660517> Ajudado por', value: ticket.claimed ? `<@${ticket.claimed}>` : 'Ninguém' || "Não alocado.", inline: true })
                .addFields({ name: 'Nickname', value: ticket.nickname || "Não alocado.", inline: true })
                .addFields({ name: '<:opentime:1164262873967628441> Aberto em', value: userTimestamp.toLocaleString(), inline: true })
                .addFields({ name: '<:reason:1164262879013376131> Motivo', value: ticket.motivo || "Não alocado.", inline: false })
            //if (user) embed.setThumbnail(user.avatarURL())

            const components = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket-star-1-${ticket.id}`)
                        .setEmoji('⭐')
                        .setLabel('1')
                        .setStyle(ButtonStyle.Danger)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket-star-2-${ticket.id}`)
                        .setEmoji('⭐')
                        .setLabel('2')
                        .setStyle(ButtonStyle.Danger)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket-star-3-${ticket.id}`)
                        .setEmoji('⭐')
                        .setLabel('3')
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket-star-4-${ticket.id}`)
                        .setEmoji('⭐')
                        .setLabel('4')
                        .setStyle(ButtonStyle.Success)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket-star-5-${ticket.id}`)
                        .setEmoji('⭐')
                        .setLabel('5')
                        .setStyle(ButtonStyle.Success)
                )

            const component2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Claim')
                        .setEmoji('📄')
                        .setLabel('Ver Transcript')
                        .setURL(`${url}${ticket.id}`)
                        .setStyle(ButtonStyle.Link)
                )

            channel.send({ embeds: [embed], components: [component2], files: [attachment] })

            user.send({ embeds: [embed], components: [components], files: [attachment] })

            await db.Tickets.updateOne({ _id: ticket.id }, { $set: { transcript: transcriptString } })

            await interaction.reply(`Olá ${interaction.user}, este ticket será excluído em 5 segundos...`)
            setTimeout(() => {
                try {
                    interaction.channel.delete()
                } catch (e) {
                    return;
                }
            }, 5000)
        }
    }
    if (interaction.isButton()) return;

    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('modal-opc')) {

            let lastDigit = interaction.customId.slice(-1);

            let category;

            // Código para lidar com modal-opc, agora que você sabe que é um deles
            switch (lastDigit) {
                case '1':
                    category = '1146596184446750720'
                    break;
                case '2':
                    category = '1146596182752247949'
                    break;
                case '3':
                    category = '1146596257683493007'
                    break;
                case '4':
                    category = '1146614392549552239'
                    break;
                default:
                    category = '1146596184446750720'
                    break;
            }


            const nicknameInput = interaction.fields.getTextInputValue('nickaname');
            const reasonInput = interaction.fields.getTextInputValue('reason');

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Ticket System')
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription('Aqui será seu canal para atendimento <@' + interaction.user.id + '>, a partir daqui é só aguardar que alguém da nossa equipe já vai entrar em contato. Pode se sentir a vontade para nos dar mais detalhes.')
                .addFields({ name: 'Nickname', value: nicknameInput, inline: false })
                .addFields({ name: 'Motivo', value: reasonInput, inline: false })

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close-ticket')
                        .setLabel('🔒 Fechar Ticket')
                        .setStyle(ButtonStyle.Danger)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('claim-ticket')
                        .setEmoji('<:claim:1164262877033660517>')
                        .setLabel('Claim Ticket')
                        .setStyle(ButtonStyle.Secondary)
                )

            const GetChannelsOnCategory = client.channels.cache.get(category);
            const childrenNames = GetChannelsOnCategory.children.cache.map(c => c.name);

            var maiorNumero = 0;

            for (var i = 0; i < childrenNames.length; i++) {
                var numero = parseInt(childrenNames[i].split("・").pop());
                if (!isNaN(numero) && numero > maiorNumero) {
                    maiorNumero = numero;
                }
            }

            var newNumber = maiorNumero > 0 ? maiorNumero + 1 : 1;

            let channel = await interaction.guild.channels.create({
                name: `${interaction.user.username}・${newNumber}`,
                topic: ``,
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [
                            PermissionFlagsBits.ViewChannel
                        ]
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.EmbedLinks,
                            PermissionFlagsBits.AddReactions
                        ]
                    }
                ]
            }).then(async (ch) => {
                interaction.reply({ content: `✅ Olá ${interaction.user}, seu ticket foi aberto em ${ch}!`, ephemeral: true })
                ch.send({ embeds: [embed], components: [button], content: '<@&1157659945630711849>' });

                let ticket = await db.Tickets.create({
                    user: interaction.user.id,
                    nickname: nicknameInput,
                    reason: reasonInput,
                    stars: 0,
                    data: Date.now(),
                })
                ch.setTopic(`id: "${ticket._id}"`);
            })
        }
    }


    if (interaction.isChatInputCommand()) return;

    if (interaction.customId === "painel_ticket") {
        let opc = interaction.values[0];

        let customId; // Para armazenar o customId do modal

        switch (opc) {
            case 'ticket-opc1':
                customId = 'modal-opc1';
                break;
            case 'ticket-opc2':
                customId = 'modal-opc2';
                break;
            case 'ticket-opc3':
                customId = 'modal-opc3';
                break;
            case 'ticket-opc4':
                customId = 'modal-opc4';
                break;
            default:
                customId = 'modal-opc1';
        }

        const modal = new ModalBuilder()
            .setTitle('Ticket System')
            .setCustomId(customId);

        const nickname = new TextInputBuilder()
            .setCustomId('nickaname')
            .setRequired(true)
            .setLabel('🎮 Informe seu nick no Jogo.')
            .setPlaceholder('Ex: Reavik')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(20)
            .setMinLength(3)

        const reason = new TextInputBuilder()
            .setCustomId('reason')
            .setRequired(true)
            .setLabel('📨 Informe sua dúvida')
            .setPlaceholder('Nos de mais detalhes sobre o motivo do ticket')
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1000)

        const firstActionRow = new ActionRowBuilder().addComponents(nickname)
        const SecondActionRow = new ActionRowBuilder().addComponents(reason)

        modal.addComponents(firstActionRow, SecondActionRow);

        interaction.showModal(modal);
    }
}