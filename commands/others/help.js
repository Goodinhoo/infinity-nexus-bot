const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const RedProtectData = require('../../data/RedProtect.js')

function processObjects(data) {
    data.forEach(item => {
        const obj = { name: item.titulo, value: item.titulo };
        // Faça algo com 'obj' aqui
        console.log(obj);
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Comandos de ajuda =)')
        .addSubcommand(subcommand =>
            subcommand
                .setName('rp')
                .setDescription('RedProject commands')
                .addStringOption(option =>
                    option
                        .setName('options')
                        .setDescription('Comando do RedProtect')
                        .setRequired(true)
                        .addChoices(
                            { name: "Gerenciamento de Membros", value: '0' },
                            { name: "Gerenciamento de Regiões", value: '1' },
                            { name: "Limites de Blocos e Regiões", value: '2' },
                            { name: "Comandos Úteis", value: '3' },
                            { name: "Comandos de Admin ou Mod", value: '4' },
                            { name: "Criação de Portal", value: '5' },
                            { name: "Comandos de Console", value: '6' },
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rota')
                .setDescription('Ajustar as rotas')
        )
    ,

    execute: async (client, interaction) => {
        try {
            const subcommand = interaction.options.getSubcommand();
            const options = interaction.options.getString('options');

            if (subcommand === 'rp') {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(RedProtectData[Number(options)].title)
                    .setURL('https://github.com/FabioZumbi12/RedProtect/wiki')
                    .setThumbnail('https://camo.githubusercontent.com/76332d6763a41354a4dd467b27a628398c9a010c4eed344f2354f65e842b53f9/68747470733a2f2f6d656469612e666f72676563646e2e6e65742f6174746163686d656e74732f3132332f3831352f7265642d70726f746563742d706c7573312e706e67')
                    //.setAuthor({ name: 'RedProtect', url: 'https://github.com/FabioZumbi12/RedProtect/wiki' })
                    .setDescription(RedProtectData[Number(options)].lista.map(item => `**${item.command}** - ${item.description}`).join('\n\n'))
                    .setTimestamp()
                    .setFooter({ text: `${client.user.username} - RedProject`, iconURL: `${client.user.avatarURL()}` });

                interaction.reply({ embeds: [embed], ephemeral: true, content: `**${interaction.user}**, aqui está a lista de comandos do RedProtect.` });
            }
            else if (subcommand === 'rota') {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Restaurando Configurações de Rede no Windows')
                    .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5eEPLbeJZkTGN5OEM-_FK5jaYu3SgFPoonA&usqp=CAU')
                    .setDescription(
                        'Observe que esses comandos afetam todos os seus adaptadores de rede, tanto físicos quanto virtuais, tanto os utilizados quanto os não utilizados, então você verá alguns erros ao executar esses comandos, nos quais os resets foram direcionados a adaptadores que não estão sendo usados. Esses erros são perfeitamente normais e não são motivo de preocupação. Execute cada etapa na ordem indicada, mesmo que você já tenha feito algumas delas anteriormente, e mesmo que encontre erros.\n' +

                        '\nNa caixa de pesquisa na barra de tarefas, clique em Iniciar, digite **prompt de comando**, clique com o botão direito no resultado do prompt de comando e selecione **Executar como administrador** e confirme.\n' +
                        '\nNo **prompt de comando**\n(não reinicie sua máquina até inserir o comando final):\n\n' +
                        'Digite e pressione Enter:```ipconfig /release```\n' +
                        'Digite e pressione Enter:```ipconfig /flushdns```\n' +
                        'Digite e pressione Enter (Isso levará um momento.):```ipconfig /renew```\n' +
                        'Digite e pressione Enter (Não reinicie ainda):```netsh int ip reset```\n' +
                        'Digite e pressione Enter:```netsh winsock reset```\n' +
                        'Agora, reinicie sua máquina usando\n**Iniciar > Energia > Reiniciar**\nmais uma vez e teste para ver se o problema foi resolvido.')

                interaction.reply({ embeds: [embed], ephemeral: true, content: `**${interaction.user}**, uma ajudinha pra problema de rota` })

            }


        } catch (e) { // Catch Err
            console.log(e)
            interaction.channel.send({
                content: `Error:\n` + e, ephemeral: true,
            });
        }
    }
};
