const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Seta o volume do bot de música')
    .addIntegerOption(option =>
      option.setName('valor')
        .setDescription('O valor do volume entre 0 e 150')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(150)),
        
  execute: async (client, interaction) => {
    const volume = interaction.options.getInteger('valor');

    // Verifica se o bot está em um canal de voz
    const queue = client.player.getQueue(interaction.guild.id);
    if (!queue) {
      return interaction.reply({ content: 'Não há música tocando no momento!', ephemeral: true });
    }

    // Altera o volume da música
    queue.setVolume(volume);

    // Responde ao usuário
    await interaction.reply({ content: `Volume setado para ${volume}`, ephemeral: true });
  },
};
