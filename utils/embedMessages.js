const { EmbedBuilder } = require('discord.js')
const client = require('../bot.js')

function errorEmbed(message) {
    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Error')
        .setDescription(message)
        //.setFooter(`${client.user.username}`, client.user.avatarURL())
    return embed;
}

module.exports = { errorEmbed }