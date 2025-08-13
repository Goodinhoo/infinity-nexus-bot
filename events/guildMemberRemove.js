const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');
const { joinAndLeave } = require('../config/config.js');

function substituirNumerosPorEmojis(texto) {
    // Mapeia números para emojis correspondentes
    const mapaNumerosEmojis = {
        '0': '0️⃣',
        '1': '1️⃣',
        '2': '2️⃣',
        '3': '3️⃣',
        '4': '4️⃣',
        '5': '5️⃣',
        '6': '6️⃣',
        '7': '7️⃣',
        '8': '8️⃣',
        '9': '9️⃣',
    };

    // Substitui cada número pelo emoji correspondente
    const textoComEmojis = texto.replace(/[0-9]/g, (match) => (mapaNumerosEmojis[match] || match) + ' ');

    return textoComEmojis;
}

module.exports = async (client, member) => {
    const channelMembersCount = member.guild.channels.cache.get(joinAndLeave.membersCount);
    if (channelMembersCount) {
        channelMembersCount.setTopic(`Já somos ${substituirNumerosPorEmojis(`${member.guild.memberCount}`)} Membros! Divulgue o server para seus amigos!`);
    }
}
