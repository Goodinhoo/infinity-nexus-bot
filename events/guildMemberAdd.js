const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');

const jimp = require('jimp');
const Canvas = require('canvas');
const { joinAndLeave } = require('../config/config.js');


function formatDateToDDMMYYYY() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    return `${day}/${month}/${year}`;
}
const channelID = joinAndLeave.welcome

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
    try {
        const role = member.guild.roles.cache.find(role => role.id === "1377241375787057223");
        if (role) {
            member.roles.add(role);
        }
        const channelMembersCount = member.guild.channels.cache.get(joinAndLeave.membersCount);
        if (channelMembersCount) {
            channelMembersCount.setTopic(`Já somos ${substituirNumerosPorEmojis(`${member.guild.memberCount}`)} Membros! Divulgue o server para seus amigos!`);
        }

        const channelWelcome = member.guild.channels.cache.get(channelID);
        if (!channelWelcome) return;

        // Create Canvas
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        // Background
        const background = await Canvas.loadImage('./images/welcome.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        // Layer
        const layer = await Canvas.loadImage('./images/layer.png');
        ctx.drawImage(layer, 0, 0, canvas.width, canvas.height);

        // Avatar Person Image
        let avatar = await jimp.read(member.user.displayAvatarURL({ extension: 'png', size: 1024, forceStatic: true }));
        avatar.resize(1024, 1024).circle()
        avatar = await avatar.getBufferAsync('image/png');
        avatar = await Canvas.loadImage(avatar);
        ctx.drawImage(avatar, 72, 48, 150, 150);

        // Texto
        // User Name
        const name = member.user.username.length > 16 ? member.user.username.substring(0, 16) + '...' : member.user.username;
        ctx.font = `32px tahomabd`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'start';
        ctx.strokeStyle = '#f5f5f5';
        ctx.fillText(`${name}`, 278, 113);

        // Data
        ctx.font = `18px tahomabd`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${formatDateToDDMMYYYY()}`, 530, 156);

        // Welcome
        ctx.font = `18px tahomabd`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`Bem-vindo(a)`, 275, 58);

        // Infinity Nexus
        ctx.font = `32px tahomabd`;
        let gradientText = 'Infinity Nexus'
        const gradientRect = {
            x: 295,
            y: 220,
            width: ctx.measureText(gradientText).width - 90,
            height: 36
        }

        const gradient = ctx.createLinearGradient(gradientRect.x, gradientRect.y, gradientRect.x + gradientRect.width, gradientRect.y + gradientRect.height);
        gradient.addColorStop(0, 'blue');
        gradient.addColorStop(1, 'purple');
        ctx.fillStyle = '#fff';
        ctx.fillText(gradientText, gradientRect.x, gradientRect.y);
        // Infinity Nexus - Stroke
        ctx.strokeStyle = gradient;
        ctx.strokeText(gradientText, gradientRect.x, gradientRect.y);


        channelWelcome.send({ content: `||${member.user}||`, files: [{ attachment: canvas.toBuffer(), name: 'welcome.jpg' }] })
    } catch (err) {
        console.log(chalk.red(`[GuildMemberADD] ${err}`));
    }
}
