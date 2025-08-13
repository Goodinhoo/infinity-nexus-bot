const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Cria um embed com as informações fornecidas.'),
  execute: async (client, interaction) => {
    await interaction.reply('Pong!');
  },
};