const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config/config.js');

var messageID;
let tempoMin = Date.now() + (10 * 60 * 1000);
async function playerController(client, queue, command) {
    //console.log(command)
    const channel = client.channels.cache.get(config.music.channelDJ);
    if (!channel) return;

    let messages = await channel.messages.fetch({ limit: 10 }).then(msg => msg.filter(m => m.author.id === client.user.id).last());

    //let lastMessage = messages.find(m => m.author.id === client.user.id);

    
        if (!queue) {
            if (!messages)
                channel.send({ embeds: [await NothingPlaying(client)], components: await addRows(), content: '' });
            else messages.edit({ embeds: [await NothingPlaying(client)], components: await addRows(), content: '' });
            return;
        }
        const listSongs = client.player.getQueue(queue.textChannel.guildId);
        if (!listSongs > 0) {
            if (!messages)
                channel.send({ embeds: [await NothingPlaying(client)], components: await addRows(), content: '' });
            else messages.edit({ embeds: [await NothingPlaying(client)], components: await addRows(), content: '' });
            return;
        }

        // Current Song
        let current = listSongs.songs[0];


        const maxCharacters = 1980;
        let text = `\nTotal: (${listSongs.songs.length})`;
        let charactersCount = 0;

        for (let idx = 1; idx < listSongs.songs.length; idx++) {
            const data = listSongs.songs[idx];
            const itemText = `\n\`${idx + 1}\` | ${data.name} | **${data.uploader.name}** (by ${data.user.username})`;

            // Verifique se a adição do próximo item não excederá o limite de caracteres
            if (charactersCount + itemText.length > maxCharacters) {
                break;
            }

            text = itemText + text;
            charactersCount += itemText.length;
        }

        if (!messages)
            channel.send({
                content: text,
                embeds: [await Playing(client, listSongs, current)],
                components: await addRows()
            });
        else messages.edit({
            content: text,
            embeds: [await Playing(client, listSongs, current)],
            components: await addRows()
        });
}

function formatNumber(number) {
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(2) + ' B';
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(2) + ' M';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(2) + ' K';
    } else {
        return number.toString();
    }
}

async function NothingPlaying(client) {
    const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle('No song playing currently')
        .setImage('https://cdn.discordapp.com/attachments/1145230976935538778/1156006874810957944/outerspace-58.gif')
        .setFooter({ text: `${client.user.username} - by harrykaray`, iconURL: client.user.displayAvatarURL() })
    return embed;
}

async function Playing(client, queue, current) {
    const embed = new EmbedBuilder()
        .setColor('Blue')
        .setURL(current.url)
        .setImage(current.thumbnail)
        .setFooter({ text: `${client.user.username} - by harrykaray`, iconURL: client.user.displayAvatarURL() })
        .setAuthor({ name: `${current.uploader.name}`, url: `${current.uploader.url}` })
        .setDescription(`[${current.name}](${current.url})`)
        .addFields(
            { name: 'Duração', value: `${current.formattedDuration}`, inline: true },
            { name: 'Visualizações', value: `${formatNumber(current.views)}`, inline: true },
            { name: 'Likes', value: `${formatNumber(current.likes)}`, inline: true },
            { name: 'Loop', value: `${queue.repeatMode == 0 ? 'Desativado' : queue.repeatMode == 1 ? 'Música' : 'Playlist'}`, inline: true },
            { name: 'Autoplay', value: `${queue.autoplay == true ? 'Ativado' : 'Desativado'}`, inline: true },
            { name: 'Pedido por', value: `${current.user}`, inline: true}
        )
    return embed;
}

async function addRows() {
    const fristRows = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('player-pause')
                .setEmoji('⏯️')
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('player-stop')
                .setEmoji('⏹️')
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('player-skip')
                .setEmoji('⏭️')
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('player-loop')
                .setEmoji('🔄')
                .setStyle(ButtonStyle.Secondary)
        )

    const SecondRows = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('player-play')
                .setEmoji('▶️')
                .setLabel('Tocar Musica')
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('player-autoplay')
                .setEmoji('♾')
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('player-shuffle')
                .setEmoji('🔀')
                .setStyle(ButtonStyle.Secondary)
        )

    return [fristRows, SecondRows];
}

module.exports = { playerController };