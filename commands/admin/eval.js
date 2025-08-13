const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const pterodactyl = require('../../hooks/pterodactylServer.js');

const { inspect } = require("util");
function toObject(obj) {
    const options = {
        depth: 1, // Define a profundidade máxima da inspeção
        compact: true, // Suprime a saída de objetos muito grandes
        breakLength: Infinity // Suprime a quebra de linha na saída
    };

    return (inspect(obj, options));
}

module.exports = {
    name: "eval",
    description: "use Eval command only ownerBot..",

    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Apenas para os Desenvolvedores..')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Type the code to execute. ( onyl by ownerbot )')
                .setRequired(true)
        ),

    execute: async (client, interaction) => {
        // Catch the value
        let toEval = interaction.options.getString("code")
        const queue = client.player.getQueue(interaction.guild.id);

        try {
            // Execute
            let evaluated = inspect(eval(toEval))

            // Time Executed
            let hrDiff = process.hrtime(process.hrtime());
            // Embed
            const embed = new EmbedBuilder()
                .setTitle("EVAL").setColor('ffa954')
                .setDescription(`Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*\`\`\`js\n${evaluated.length > 1950 ? evaluated.slice(0, 1950 - 3) + '...' : evaluated}\n\`\`\``)
                .setThumbnail(interaction.member.user.displayAvatarURL())
                .setFooter({ text: interaction.member.user.username })
            interaction.reply({ content: "Processing: ```" + toEval + "```", ephemeral: false, embeds: [embed] })
        } catch (e) { // Catch Err
            interaction.channel.send({
                content: `An error occurred : \`${e.message}\``
            });
        }
    }
};
