const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const path = require('node:path');
const fs = require("fs");
const chalk = require('chalk')
const db = require('./data/database');

// Imports for Music Player
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { DeezerPlugin } = require("@distube/deezer");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { YouTubePlugin } = require("@distube/youtube");

const client = new Client({
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
    GatewayIntentBits.GuildMessageReactions, // for message reactions
  ],
});
process.on("uncaughtException", (error) => {
    return;
});

process.on("unhandledRejection", (reason, promise) => {
    return;
});
const config = require("./config/config.js");
client.config = config;

// Music System
const thecookie = "GPS=1; YSC=UzmnlR_RJRs; VISITOR_INFO1_LIVE=J4hpsR8_tpI; PREF=tz=America.Sao_Paulo&f6=40000000; CONSISTENCY=AGXVzq9SZXrosveqXTxf7tdUxMBnuF9AMkMstTwFzMI85fQNPD8jK1sgnEmBgZ_LB3xRneOZn97XL_X3tIfzLldrv2lQQBrvXz2VDsuwAm0HyIJokf9JA5UB1WIiIMKE8426My-ryrDBF_cS2fPwaos";
client.player = new DisTube(client, {
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin(),
    new SoundCloudPlugin(),
    new YtDlpPlugin({ update: false }),
    new DeezerPlugin(),
    new YouTubePlugin()
  ],
});
const player = client.player;

// Load all Events from the ./events folder
function loadEvents(folder, client, type) {
  // Lê os conteúdos da pasta
  const files = fs.readdirSync(path.resolve(folder));

  for (const fileName of files) {
    const filePath = path.join(folder, fileName);
    const stats = fs.statSync(filePath);

    // Se for um subdiretório, chama a função recursivamente
    const folderName = path.basename(path.resolve(folder));
    if (stats.isDirectory()) {
      loadEvents(filePath, client);
    } else if (filePath.endsWith('.js')) {
      // Se for um arquivo JavaScript, carrega o evento
      const event = require(path.resolve(filePath));
      const eventName = path.basename(fileName, '.js');
      if (folderName == 'player') {
        console.log(chalk.cyan(`[ Bot ] `) + chalk.yellow('Player Event Loaded: ') + chalk.green(eventName));
        player.on(eventName, event.bind(null, client));
      } else {
        console.log(chalk.cyan(`[ Bot ] `) + chalk.yellow('Bot Event Loaded: ') + chalk.green(eventName));
        client.on(eventName, event.bind(null, client));
      }
    }
  }
}
// Uso da função
loadEvents('./events', client);

// Load all Commands from the ./commands folder
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      command.category = folder;
      client.commands.set(command.data.name, command);
      console.log(chalk.cyan(`[ Bot ] `) + chalk.yellow('Command Loaded: ') + chalk.red(`[${folder}] `) + chalk.green(command.data.name));
      //console.log(`Comando carregado: [${folder}] ${command.data.name}`);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Bot Login
if (config.TOKEN || process.env.TOKEN) {
  client.login(config.TOKEN || process.env.TOKEN).catch((e) => {
    console.log('O token do bot que você inseriu no projeto é incorreto ou as intents do seu bot estão desligadas!');
  });
} else {
  setTimeout(() => {
    console.log('Por favor coloque o token no bot no token.js ou no seu .env do seu projeto!');
  }, 2000);
}

const express = require("express");
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);

module.exports = client;