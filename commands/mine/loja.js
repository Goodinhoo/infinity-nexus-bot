const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loja')
    .setDescription('Para ver o site da nossa loja.'),
  execute: async (client, interaction) => {
    await interaction.reply('**Loja:**  [infinitynexus.pro](https://infinitynexus.pro/)');
  },
};