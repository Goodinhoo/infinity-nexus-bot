module.exports = async function initExpress(discordClient) {
  const guild = await discordClient.guilds.fetch('312220535801118721');
  const channel = await guild.channels.fetch('547393153938751489');
  try {
      if (channel && channel.isTextBased()) {
        await channel.send('Iniciando o express...');
      }
    require('./express.js');
    await channel.send('Express iniciado com sucesso!');
  } catch (err) {
    console.error('Erro ao iniciar o express:', err);
    // Envia o erro para o canal do Discord
    try {
      if (channel && channel.isTextBased()) {
        await channel.send(
          'Erro ao iniciar o express:\n```js\n' + (err && err.stack ? err.stack : String(err)) + '\n```'
        );
      }
    } catch (sendErr) {
      console.error('Erro ao enviar mensagem de erro para o Discord:', sendErr);
    }
  }
};