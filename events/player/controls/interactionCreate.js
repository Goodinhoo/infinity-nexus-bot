const { ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');

const { playerController } = require('../../../hooks/PlayerController');

function SendEmbedMessage(client, interaction, msg, error) {
    const queue = client.player.getQueue(interaction.guild.id);
    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Error')
        .setDescription(msg)
        .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() });

    if (error) {
        return interaction.reply({
            content: `${interaction.user}`,
            embeds: [embed], 
            ephemeral: false
        })
            .then(async Message => {
                setTimeout(() => {
                    Message.delete();
                }, 4000);
            })
    }
    return interaction.reply({
        content: `${interaction.user}, ` + msg,
        //embeds: [embed], 
        ephemeral: false
    })
        .then(async Message => {
            setTimeout(() => {
                Message.delete();
            }, 4000);
        })
}
module.exports = async (client, interaction) => {
    // Caso o customID, comece com player
    if (!interaction.customId) return;
    if (!interaction.customId.startsWith('player')) return;

    const queue = client.player.getQueue(interaction.guild.id);

    // If Bot voice is not equals to member voice
    //if (interaction.member.voice.channel.id !== interaction.guild.me.voice.channelId) {
    //    return interaction.reply({ content: 'Você não está no mesmo canal de voz que eu.', ephemeral: true });
    //}

    if (interaction.isButton()) {
        if (interaction.customId === 'player-play') {
            const modal = new ModalBuilder()
                .setTitle('Player System')
                .setCustomId('player-play-modal');

            const playMusic = new TextInputBuilder()
                .setCustomId('name')
                .setRequired(true)
                .setLabel('🎵 Toque uma música.')
                .setPlaceholder('Nome, Link, Playlist, etc..')
                .setStyle(TextInputStyle.Short)


            const firstActionRow = new ActionRowBuilder().addComponents(playMusic)

            modal.addComponents(firstActionRow);

            interaction.showModal(modal);
            return;
        }
        if (!queue) return interaction.reply({ content: 'Não tem nada tocando no momento.', ephemeral: true });

        try {
            if (interaction.customId === 'player-pause') {
                if (queue.paused == false) await queue.pause()
                else await queue.resume(interaction.guild.id);
                SendEmbedMessage(client, interaction, `${queue.paused == false ? '⏸️ Música continuada!' : '▶️ Música pausada!'}`)
            }

            if (interaction.customId === 'player-skip') {
                await queue.skip(interaction.guild.id);
                SendEmbedMessage(client, interaction, '⏭️ Música pulada!')
            }
            if (interaction.customId === 'player-stop') {
                await queue.stop(interaction.guild.id);
                SendEmbedMessage(client, interaction, `⏹️ Música parada!`)
            }
            if (interaction.customId === 'player-loop') {
                await queue.setRepeatMode(queue.repeatMode == 0 ? 1 : queue.repeatMode == 1 ? 2 : 0);
                SendEmbedMessage(client, interaction, `🔁 Loop ${queue.repeatMode == 0 ? '**Desativado**' : queue.repeatMode == 1 ? '**Música**' : '**Playlist**'}`)
            }
            if (interaction.customId === 'player-shuffle') {
                await queue.shuffle(interaction.guild.id);
                SendEmbedMessage(client, interaction, `🔀 Playlist embaralhada!`)
            }
            if (interaction.customId === 'player-autoplay') {
                await queue.toggleAutoplay(!queue.autoplay);
                SendEmbedMessage(client, interaction, `♾️ Autoplay ${queue.autoplay == false ? '**Desativado**' : '**Ativado**'}`)
            }
            playerController(client, queue)
        } catch (e) {
            console.log("E ? "+e)
            SendEmbedMessage(client, interaction, `Ocorreu um erro ao executar este comando!\n**${e.message}**`, 'Error')
        }
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId == 'player-play-modal') {
            try {
                const name = interaction.fields.getTextInputValue('name');
                await client.player.play(interaction.member.voice.channel, name, {
                    member: interaction.member,
                    textChannel: interaction.channel,
                    interaction
                });
                SendEmbedMessage(client, interaction, '✅ Música(s) adicionada(s) na fila!');
            } catch (e) {
                console.log(e);
                SendEmbedMessage(client, interaction, 'Sem resultados! ❌');
            }
            return;
        }
    }
}