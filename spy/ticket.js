const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

let lastTicket = "";

function ticketListening(discordClient, message) {
    const ticketContent = message.content.match(/\[Ticket\]:\s(.+?)(?:\s?:\[Ticket\])?$/);

    if (!ticketContent) return;

    const CATEGORY_ID = "1344318185461125181"; // ID da categoria onde os tickets serão criados

    let ticketMessage = ticketContent[1].trim();
    ticketMessage = ticketMessage.replace(":[Ticket]", "").replace(/`/g, "");

    // Divide a string corretamente pegando o nome do autor antes do primeiro " - "
    const parts = ticketMessage.split(" - ");
    const authorName = parts.shift(); // Nome do autor antes do " - "
    const content = parts.join(" - "); // O restante da mensagem

    const args = content.split(" ");
    let category = args.shift().toLowerCase(); // Tenta pegar a categoria

    // Lista de categorias válidas
    const categoriasValidas = ["bug", "reportar", "sugestão"];
    if (!categoriasValidas.includes(category)) {
        args.unshift(category); // Devolve o valor para a descrição
        category = "geral"; // Assume como "geral"
    }

    const description = args.join(" ");

    if (!description) return;

    if (lastTicket === description) {
        message.reply("sendmessage " + authorName + " §cNão abra tickets duplicados!");
        return;
    }

    lastTicket = description;

    // Definições de cores e títulos para cada categoria
    const categories = {
        "bug": { color: 0xFF0000, title: "🚨 Reporte de Bug" },
        "reportar": { color: 0xFFA500, title: "⚠️ Reporte de Jogador" },
        "sugestão": { color: 0x00FF00, title: "💡 Sugestão" },
        "geral": { color: 0x0099FF, title: "📌 Ticket Geral" }
    };

    const types = {
        "bug": "Bug",
        "reportar": "Reportar Player",
        "sugestão": "Sugestão",
        "geral": "Geral"
    };

    const embedConfig = categories[category] || categories["geral"];
    const embedType = types[category] || types["geral"];

    const user = discordClient.users.cache.find(user => user.username === authorName);
    let userID = "131907612529786880";
    if (user) {
        userID = user.id;
    }

    const embed = new EmbedBuilder()
        .setColor(embedConfig.color)
        .setTitle(embedConfig.title)
        .setDescription(`<@&1157659945630711849> \n**Novo Ticket Recebido!**\n**Enviado por:** ${user || authorName}\n**Categoria:** \`${embedType}\`\n**Descrição:** \n\`` + description + "\`" || "Nenhuma descrição fornecida.")
        .setFooter({ text: `Enviado por: ${authorName}` })
        .setTimestamp();

    // Criar o canal com o nome do autor dentro da categoria especificada
    discordClient.guilds.cache.get(message.guild.id).channels.create({
        name: `${authorName}-〔${embedType}〕`,
        type: 0, // 'GUILD_TEXT'
        topic: description,
        parent: CATEGORY_ID, // ID da categoria onde o canal será criado
        reason: `Ticket criado por ${authorName}`,
       permissionOverwrites: [
        {
            id: message.guild.roles.everyone.id, // Bloqueia o @everyone
            deny: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.AddReactions
            ]
        },
        {
            id: userID, // Permite o autor do ticket ver e interagir
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.AddReactions
            ]
        }
    ]
    }).then(channel => {
        channel.send({ embeds: [embed] });
    }).catch(console.error);
}

module.exports = ticketListening;
