const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { lojaSquare } = require('../../config/config');
const cheerio = require('cheerio');
const { getProducts } = require('../../hooks/lojaSquare')

function extractFromHtml(htmlString) {
    const $ = cheerio.load(htmlString);
    // Extração do texto das tags <p>
    const texto = $('p').map((i, el) => $(el).text()).get().join('\n');

    // Extração dos URLs das imagens das tags <img>
    const imagens = $('img').map((i, img) => $(img).attr('src')).get();

    return { texto, imagens };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('produtos')
        .setDescription('Nossos produtos da loja.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('item')
                .setDescription('Item da loja')
                .addStringOption(option =>
                    option
                        .setName('item')
                        .setDescription('Item da loja')
                        .setRequired(true)
                        .addChoices(
                            { name: "Vip", value: 'vip' },
                            { name: "Vip+", value: 'vipplus' },
                            { name: "Vip Nexus", value: 'vipnexus' },
                            { name: "Vip Infinity", value: 'vipinfinity' },
                            { name: "Chunk Loader (7D)", value: 'chunkloader7d' },
                            { name: "Chunk Loader (3x3 30D)", value: 'chunkloader3x330d' },
                            { name: "Chunk Loader (30D)", value: 'chunkloader30d' },
                            { name: "Chunk Loader (3x3 ∞)", value: 'chunkloaderinfinito' },
                            { name: "Kit Comum", value: 'kit_comum' },
                            { name: "Kit Incomum", value: 'kit_incomum' },
                            { name: "Kit Raro", value: 'kit_raro' },
                            { name: "Kit Lengendário", value: 'kit_legendario' },
                            { name: "Premium Pass", value: 'premium_pass' },
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Uma lista de todos os produtos')
        ),


    execute: async (client, interaction) => {
        let produtos = await getProducts();
        const subcommand = interaction.options.getSubcommand();
        const options = interaction.options.getString('item');

        try {
            if (subcommand === 'list') {
                let embed = await new EmbedBuilder()
                .setTitle('Loja Nexus')
                .setDescription('```js\n'+produtos.map(produto => `${produto.produto}\nR$ ${produto.valor} | ${produto.dias} dias`).join('\n')+'```')
                .setFooter({ text: `${client.user.username} Store`, iconURL: client.user.avatarURL() })
                .setColor('#7547a3')
                
                interaction.reply({ embeds: [embed], content: `**${interaction.user}**, aqui está toda a lista dos nossos produtos.`, ephemeral: true })
            }

            if (subcommand === 'item') {
                let data = produtos.find(produto => produto.grupo === options);
                let descData = extractFromHtml(data.outros.descricao)

                let embed = await new EmbedBuilder()
                    //.setColor(`#ffffff`)
                    .setTitle(data.produto)
                    .setDescription(descData.texto)
                    .setThumbnail(data.outros.imagem)
                    .setFooter({ text: `${client.user.username} Store`, iconURL: client.user.avatarURL() })
                    .setColor('#7547a3')
                    //.addFields({ name: 'Atenciosamente', value: 'Equipe Nexus', inline: false })
                    .addFields({ name: 'Valor', value: `${data.valor}`, inline: true })
                    .addFields({ name: 'Dias', value: `${data.dias}`, inline: true })
                    .setImage(descData.imagens[0])

                interaction.reply({ embeds: [embed], content: `**${interaction.user}**, aqui está o produto que você solicitou.`, ephemeral: true })
            }
        } catch (e) {
            if (client.errorLog) {
                let embed = new EmbedBuilder()
                    .setColor("#7547a3")
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