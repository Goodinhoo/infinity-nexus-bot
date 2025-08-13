const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');

module.exports = async (client, reaction, user) => {
    if (client.user.id == user.id) return;

    if (reaction.message.channelId == '778403857063346186') {

        let roleID;
        switch (reaction.emoji.name) {
            case "1️⃣":
                roleID = "1147606724266692720"; // Anuncios
                break;
            case "2️⃣":
                roleID = "1147606749394763887"; // Novidades
                break;
            case "3️⃣":
                roleID = "1147606766763376780"; // Promoções
                break;
            case "4️⃣":
                roleID = "1147606789760745493"; // Status
                break;
        }

        if (roleID) { // Anuncios
            const role = await reaction.message.guild.roles.cache.find(role => role.id === roleID);
            const guild = await client.guilds.cache.get(reaction.message.guildId);
            const member = await guild.members.cache.get(user.id);

            try {
                await member.roles.remove(role)
            } catch (error) {
                return;
            }
        }
    }
}
