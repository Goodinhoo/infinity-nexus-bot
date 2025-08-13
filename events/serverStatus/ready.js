const { ActivityType, time, ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, AttachmentBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const chalk = require('chalk')
const config = require('../../config/config.js');
const { serverStatus } = require('../../hooks/pterodactylServer.js');
const axios = require('axios');
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { createCanvas, loadImage, registerFont } = require('canvas');

registerFont('./fonts/tahomabd.ttf', { family: 'tahomabd' });

const cpuLista = [];
const ramLista = [];

function adicionarItem(cpu, ram) { // { cpu, ram }
    // Verifique se o array tem 10 itens
    if (cpuLista.length > 9) {
        // Se tiver 10 itens, remova o primeiro item (o mais antigo)
        cpuLista.shift();
    }

    if (ramLista.length > 9) {
        // Se tiver 10 itens, remova o primeiro item (o mais antigo)
        ramLista.shift();
    }

    // Adicione o novo item ao final do array
    cpuLista.push(cpu);
    ramLista.push(ram)
}

const generateChart = async (datas, title, type, width, height) => {
    const renderer = new ChartJSNodeCanvas({ width: width, height: height });
    return await renderer.renderToBuffer({
        // Build your graph passing option you want
        type: "line", // Show a bar chart
        backgroundColor: "#fff",
        fill: true,
        data: {
            labels: datas,
            datasets: [
                {
                    data: datas,
                    backgroundColor: "rgba(236,197,1,0.2)",
                    borderColor: "rgba(236,197,1)",
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            animations: {
                radius: {
                    duration: 400,
                    easing: 'linear',
                    loop: (context) => context.active
                }
            },
            interaction: {
                mode: 'nearest',
                intersect: false,
                axis: 'x'
            },
            plugins: {
                tooltip: {
                    enabled: false
                },
                color: '#fff',
                subtitle: {
                    display: true,
                    text: title,
                    color: '#fff',
                    font: {
                        size: 50,
                        family: 'tahomabd',
                        weight: 'bold',
                    },
                    padding: {
                        bottom: 10
                    }
                },
                legend: {
                    display: false
                },
            },
            scales: {
                y: {
                    //beginAtZero: true,
                    suggestedMin: 4,
                    ticks: {
                        color: '#fff',
                        maxTicksLimit: 5,
                        font: {
                            size: 35,
                            family: 'tahomabd',
                            weight: 'bold',
                        },
                        callback: function (value, index, values) {
                            return value + ` ${type}`;
                        }
                    },
                },
                x: {
                    display: false,
                    ticks: {
                        color: '#fff',
                        font: {
                            size: 10,
                            family: 'tahomabd',
                            weight: 'bold',
                        }
                    }
                }
            },
        }
    });
};

const { inspect } = require("util");
function toObject(obj) {
    const options = {
        depth: 5, // Define a profundidade máxima da inspeção
        compact: true, // Suprime a saída de objetos muito grandes
        breakLength: Infinity // Suprime a quebra de linha na saída
    };

    return (inspect(obj, options));
}

function alignStrings(cpu, ram, disk) {
    // Converter todos os números para string para encontrar o comprimento máximo.
    let cpuStr = `${cpu} %`;
    let ramStr = `${ram} GB`;
    let diskStr = `${disk} GB`;

    // Encontrar o comprimento máximo entre as strings convertidas.
    let maxLen = Math.max(cpuStr.length, ramStr.length, diskStr.length);

    // Função para preencher com espaços.
    function pad(str, length) {
        return (str + ' '.repeat(length)).slice(0, length);
    }

    // Alinhar todas as strings para que tenham o mesmo comprimento.
    let alignedCpu = pad(cpuStr, maxLen);
    let alignedRam = pad(ramStr, maxLen);
    let alignedDisk = pad(diskStr, maxLen);

    // Montar as mensagens finais.
    const cpuMsg = `CPU  : [ ${alignedCpu} ]`;
    const ramMsg = `RAM  : [ ${alignedRam} ]`;
    const diskMsg = `DISK : [ ${alignedDisk} ]`;

    // Retornar as mensagens alinhadas.
    return `\n${cpuMsg}\n${ramMsg}\n${diskMsg}`;
}

function formatBytes(bytes) {
    if (bytes < 1024) {
        return bytes + " B";
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
}

module.exports = async (client) => {
    let tempoMin = Date.now() + (10 * 60 * 1000);
    setInterval(async () => {
        let result = await serverStatus();
        if (!result[0]) return;
        let status = result[0];

        // Get Channel
        let channel = await client.channels.cache.get(config.pterodactyl.serverStatus)
        if (!channel) return console.log(chalk.cyan('[PteroStats] ') + chalk.red('Error! Invalid Channel ID'))

        let messages = await channel.messages.fetch({ limit: 10 }).then(msg => msg.filter(m => m.author.id === client.user.id).last())
        let tempo = Date.now();
        if (messages && messages.embeds.length < 1 || tempo > tempoMin) {
            tempoMin = tempo + (10 * 60 * 1000);
            messages.delete()
            messages = null
        }

        // Conteudo da Mensagem
        let content = null;

        let rows = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('power-on')
                    .setLabel('▶️ Ligar')
                    .setStyle(ButtonStyle.Success)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('power-restart')
                    .setLabel('🔄 Reiniciar')
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('power-off')
                    .setLabel('🛑 Desligar')
                    .setStyle(ButtonStyle.Danger)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('show-console')
                    .setLabel('📑 Console')
                    .setStyle(ButtonStyle.Secondary)
            )
        /*.addComponents(
            new ButtonBuilder()
                //.setCustomId('infinty-link')
                .setLabel('Infinity Nexus')
                .setStyle(ButtonStyle.Link)
                .setURL('https://infinitynexus.lojasquare.net/')
        )*/

        // Uptime
        let uptimeInSeconds = status.utilization.uptime;

        let hours = Math.floor(uptimeInSeconds / (3600 * 1000));
        let minutes = Math.floor((uptimeInSeconds % (3600 * 1000)) / (60 * 1000));
        let seconds = (uptimeInSeconds % (60 * 1000)) / 1000;

        // Next Update
        let format = await time(new Date(Date.now() + config.pterodactyl.refresh * 1000), 'R')

        // Network
        let formattedNetwork = {
            rx: formatBytes(status.utilization.network.rx_bytes),
            tx: formatBytes(status.utilization.network.tx_bytes)
        };

        let mineInfo = '0/0';
        let mineVersion = '';

        /*await axios.get('https://api.mcsrvstat.us/3/82.180.133.132:25565')
            .then(function (response) {
                // Manipular a resposta bem-sucedida aqui
                mineinfo = response.data;
            })
            .catch(function (error) {
                // Manipular erros aqui
                //console.error('Erro ao fazer a solicitação GET:', error);
            });*/

        await axios.get('https://raw.githubusercontent.com/Playerrs/public-server-info/main/InfinityNexus.json')
            .then(function (response) {
                // Manipular a resposta bem-sucedida aqui
                mineVersion = response.data['server-version'];
            })
            .catch(function (error) {
                // Manipular erros aqui
                console.error('Erro ao fazer a solicitação GET:', error);
            });
        let serverChannel = await client.channels.cache.get('1172714937961959434');
        if (serverChannel) {
            mineInfo = serverChannel.topic.split(' ');
            mineInfo = mineInfo[0]
        }

        let cpuUsage = status.utilization.cpu_absolute.toFixed(2);
        let ramUsage = (status.utilization.memory_bytes / 1000000000).toFixed(2);
        let diskUsage = (status.utilization.disk_bytes / 1000000000).toFixed(2);


        let width = 700;  // Define a largura de cada gráfico
        let height = 450; // Define a altura de cada gráfico

        /*adicionarItem(cpuUsage, ramUsage);

        let GraphicOne = await generateChart(cpuLista, "CPU USAGE", "%", width, height);
        let GraphicTwo = await generateChart(ramLista, "RAM USAGE", "GB", width, height);
        // Create MessageEmbed passing options you want

        // Crie um canvas para combinar os dois gráficos
        let combinedCanvas = createCanvas((width * 2) + 50, height); // Duplica a largura
        let ctx = combinedCanvas.getContext('2d');

        let img1 = await loadImage(GraphicOne);
        let img2 = await loadImage(GraphicTwo);

        ctx.drawImage(img1, 0, 0);
        ctx.drawImage(img2, width + 50, 0);

        let attachment = new AttachmentBuilder(combinedCanvas.toBuffer(), { name: 'graph.png' });*/

        let embed = await new EmbedBuilder()
            .setAuthor({ name: 'Infinity Nexus', iconURL: client.user.avatarURL(), url: 'https://infinitynexus.lojasquare.net/' })
            //.setDescription(``)
            .addFields(
                { name: 'IP', value: '```diff\n' + config.ip + '```', inline: false },
                { name: 'Status', value: `${status.state == 'running' ? '``🟢 Online``' : status.state == 'starting' ? '``🟡 Starting``' : '``🔴 Offline``'}`, inline: true },
                { name: 'Players', value: '``🎮 ' + `${status.state == 'running' ? mineInfo : '0/0'}` + '``', inline: true },
                { name: 'Version', value: '``' + mineVersion + '``', inline: true },
                {
                    name: 'Resource Usage', value: '```hs' + alignStrings(cpuUsage, ramUsage, diskUsage)
                        + '```', inline: false
                },
                { name: 'Total Upload', value: `> 📤 ${formattedNetwork.tx}`, inline: true },
                { name: 'Total Download ', value: `> 📥 ${formattedNetwork.rx}`, inline: true },
                { name: 'Uptime', value: `> :alarm_clock: ${hours}h ${minutes}m.`, inline: true },
            )
            .setColor(status.state === 'running' ? '#00FF00' : status.state === 'starting' ? '#FFFF00' : '#FF0000')
            .setFooter({ text: `${client.user.username} - by harrykaray` })
            //.setImage('attachment://graph.png')
            .setTimestamp()

        if (!messages) channel.send({ content: content, embeds: [embed], components: [rows] })
        else messages.edit({ content: content, embeds: [embed], components: [rows] })
    }, config.pterodactyl.refresh * 1000);
}