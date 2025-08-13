const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deploy')
        .setDescription('Cria um embed com as informações fornecidas.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (client, interaction) => {
        const commands = [];
        const foldersPath = path.join(__dirname, '../../commands');
        const commandFolders = fs.readdirSync(foldersPath);
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                    console.log(command.data.toJSON())
                    console.log('Comando ' + command.data.name + ' Atualizado')
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }

        const rest = new REST().setToken(client.config.TOKEN);

        (async () => {
            try {
                await interaction.reply(`Started refreshing ${commands.length} application (/) commands.`);
                const data = await rest.put(
                    Routes.applicationCommands(client.config.clientId, client.config.guildId),
                    { body: commands },
                );
                console.log(data)
                await interaction.editReply(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        })();
    },
};