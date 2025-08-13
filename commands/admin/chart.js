const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { createCanvas, loadImage } = require('canvas');

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
                        size: 30,
                        family: 'tahoma',
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
                    beginAtZero: true,
                    ticks: {
                        color: '#fff',
                        maxTicksLimit: 5,
                        font: {
                            size: 18,
                            family: 'tahoma',
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
                            size: 20,
                            family: 'tahoma',
                            weight: 'bold',
                        }
                    }
                }
            },
        }
    });
};


module.exports = {
    data: new SlashCommandBuilder()
        .setName('chart')
        .setDescription('Chart? nao sei.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    execute: async (client, interaction) => {
        const width = 700;  // Define a largura de cada gráfico
        const height = 400; // Define a altura de cada gráfico

        let data = [50, 53, 12, 54, 90, 60, 100, 400, 60, 90];

        const GraphicOne = await generateChart(data, "CPU USAGE", "%", width, height);
        const GraphicTwo = await generateChart(data, "RAM USAGE", "GB", width, height);
        // Create MessageEmbed passing options you want

        // Crie um canvas para combinar os dois gráficos
        const combinedCanvas = createCanvas((width * 2)+50, height); // Duplica a largura
        const ctx = combinedCanvas.getContext('2d');

        const img1 = await loadImage(GraphicOne);
        const img2 = await loadImage(GraphicTwo);

        ctx.drawImage(img1, 0, 0);
        ctx.drawImage(img2, width+50, 0);

        let attachment = new Discord.AttachmentBuilder( combinedCanvas.toBuffer(), { name: 'graph.png' });

        let chartEmbed = new Discord.EmbedBuilder()
            .setTitle(`Titulo do Char`)
            .setColor(`#ff00ff`)
            .setImage('attachment://graph.png');

        // Generate your graph & get the picture as response

        // Reply to server / channel you  want passing MessageEmbed & messageAttachment objects
        interaction.reply({ embeds: [chartEmbed], files: [attachment] });

    }
}