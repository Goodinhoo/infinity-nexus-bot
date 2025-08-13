const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, UserContextMenuCommandInteraction } = require('discord.js');
const db = require('../../data/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Da um Warn em um usuário.')
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('O usuário que receberá a warn!')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Motivo da warn!')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('level')
                .setDescription('Nivel de aviso!')
                .setRequired(true)
                .addChoices(
                    { name: "1 - Nivel Basico (ex: Spam)", value: '1' },
                    { name: "2 - Nivel Medio (ex Racismo)", value: '2' },
                )
        ),
    execute: async (client, interaction) => {
        const reason = await interaction.options.getString('reason');
        const user = await interaction.options.getUser('user');
        const level = await interaction.options.getString('level');

        // Verificação do usuário
        let usuario = await db.Users.findOne({ _id: user.id }).exec();
        if (!usuario) { usuario = await new db.Users({ _id: user.id }).save(); console.log(usuario) }
        var userData = await db.Users.findOne({ _id: user.id });


        let dateNow = Date.now();
        let expire = level == '1' ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24 * 15;

        // Maior level de Warn
        const highestLevelWarn = await userData.warns.reduce((highest, warn) => {
            console.log(warn.warnLevel)
            if (warn.level === level && warn.warnLevel > (highest ? highest.warnLevel : 0)) {
                return warn;
            } else {
                return highest;
            }
        }, null);

        const a = warns(level, highestLevelWarn ? highestLevelWarn.warnLevel + 1 : 1);

        // Adicionar Warn
        userData.warns.push({
            reason: reason,
            level: level,
            warnLevel: highestLevelWarn ? highestLevelWarn.warnLevel + 1 : 1,
            by: interaction.user.id,
            data: dateNow,
            expire: dateNow + (expire + (1000 * 60 * 60 * 24 * a)),
        });

        userData.save();

        if (a > 100) {
            // Banimento
        } else {

        }
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Warn')
            .addFields(
                { name: 'User', value: `${user}`, inline: true },
                { name: 'Motivo', value: `${reason}`, inline: false },
                { name: 'por', value: `${interaction.user}`, inline: true },
            )
        //await interaction.reply({ embeds: [embed] });
        let content = `${user.username}, foi avisado!\n> **Reason:** ${reason}`
        content += a >= 1 && a < 100 ? `\n> **Mutado:** ${a} Dias` : a < 100 ? '' : `\n> **Banido**`;
        content += `\n> **Por:** ${interaction.user}`;
        await interaction.reply({ content: content, ephemeral: true });

    },
};

function warns(level, warnlevel) {
    if (level === '1') {
        // Aviso, Mute 1 Dia, Mute 3 Dias, Mute 7 Dias, Ban
        switch (warnlevel) {
            case 1:
                return 0;
            case 2:
                return 1;
            case 3:
                return 3;
            case 4:
                return 7;
            case 5:
                return 1000;
        }

    } else if (level === '2') {
        switch (warnlevel) {
            case 1:
                return 1;
            case 2:
                return 3;
            case 3:
                return 1000;
        }
    }
}


// 1 2 3
/*
Tempo duração:
1: 1 Semana
2: 1 Mês
3: Sim
*/

/*
() Level 1 (Warns 4)
1:
- Apenas um Aviso
- 7 Dias

2:
- Mute 1 Dia

3:
- Mute 3 Dias

4:
- Mute 7 Dias
- 15 Dias

5:
- Ban (Permanente)

() Level 2
1: Mute 1 Dia

2: Mute 3 Dias

3: Ban

() Level 3
1: Ban
*/