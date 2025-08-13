// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Partials, Collection, Events, PermissionFlagsBits } = require("discord.js");
const config = require('./config/config.json');

// Create a new client instance
const discordClient = new Client({
	partials: [
	  Partials.User, // for discord user
	  Partials.Reaction, // for message reaction
	  Partials.Message, // for message
	  Partials.Channel, // for text channel
	  Partials.GuildMember, // for guild member
	],
	intents: [
	  GatewayIntentBits.Guilds, // for guild related things
	  GatewayIntentBits.GuildMembers, // for guild members related things
	  GatewayIntentBits.GuildIntegrations, // for discord Integrations
	  GatewayIntentBits.GuildVoiceStates, // for voice related things
	  GatewayIntentBits.MessageContent, // Conteudo?
	  GatewayIntentBits.GuildMessages, // Conteudo?
	  GatewayIntentBits.GuildMessageReactions, // for message reactions
	],
  });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
discordClient.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    
    // Importar o módulo somente quando o cliente estiver pronto
    const whiteInTwitch = require('./discordToTwitchMessage.js');
	const ticketListening = require('./ticket.js');

    // Adicionar o evento MessageCreate depois de importar o módulo
    discordClient.on(Events.MessageCreate, async (m) => {
		const cannal = m.content.split(' ')[0];
		const content = m.content.split(' ').slice(1).join(' ');
        whiteInTwitch(m.channel.id, m.author.displayName, cannal, content, m.author.bot);
    });

    discordClient.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
		if(oldMessage.content === newMessage.content) return;
		ticketListening(discordClient, newMessage);
	});
});
discordClient.login(config.discord.DISCORD_TOKEN);
const initExpress = require('../treeform/initExpress.js');
initExpress(discordClient);
module.exports = discordClient;