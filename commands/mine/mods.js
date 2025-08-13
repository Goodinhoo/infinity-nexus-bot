const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mods')
        .setDescription('Lista dos mods do servidor.'),

    execute: async (client, interaction) => {
        try {
            axios.get('https://raw.githubusercontent.com/Playerrs/public-server-info/main/modlist.html')
                .then(function (response) {

                    const htmlContent = response.data

                    const $ = cheerio.load(htmlContent);

                    const allMods = $('li > a').toArray().sort((a, b) => {
                        const textA = $(a).text().toUpperCase();
                        const textB = $(b).text().toUpperCase();
                        return textA.localeCompare(textB);
                    }).map(item => {
                        return `- [${$(item).text()}](${$(item).attr('href')})`;
                    }).join('\n');

                    const splitStringByLimit = (str, limit) => {
                        const result = [];
                        let currentStr = '';
                        const lines = str.split('\n');

                        for (const line of lines) {
                            if ((currentStr + line).length > limit) {
                                result.push(currentStr.trim());
                                currentStr = '';
                            }
                            currentStr += line + '\n';
                        }

                        return result;
                    };

                    const mods = splitStringByLimit(allMods, 2000);

                    const embeds = []

                    for (const mod of mods) {
                        embeds.push(new Discord.EmbedBuilder()
                            .setColor(`Blue`)
                            .setTitle(`Mods`)
                            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() })
                            .setDescription(`${mod}`))
                    }

                    let embed = new Discord.EmbedBuilder()
                        .setColor(`Blue`)
                        .setTitle(`Mods [1/${mods.length}]`)
                        .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() })
                        .setDescription(`${mods[5]}`);
                        
                    interaction.reply({ ephemeral: false, embeds: [embed], content: 'Comando em desenvolvimento..' });
                })
        } catch (e) { // Catch Err
            interaction.channel.send({
                content: `Lista de mods não encontrada!`, ephemeral: true,
            });
        }
    }
};
