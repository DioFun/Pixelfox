const { MessageEmbed } = require("discord.js");
const { TStoShortDate } = require("../../tools/date");
module.exports = async (client, message) => {
    if (!message.guild) return;
    let data = await client.getGuild(message.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = message.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;

    let fetchGuildAuditLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: "MESSAGE_DELETE"
    });
    const latestMessageDeleted = fetchGuildAuditLogs.entries.first();
    if (latestMessageDeleted.executor.id === client.user.id) return;
    let embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`:wastebasket: Suppression d'un message`)
        .addFields([
            {name: "Contenu", value: message.content ? message.content : `Pas de contenu`, inline: true},
            {name: "Publication", value: TStoShortDate(message.createdAt), inline: true}
        ])
        .setFooter(`ID du message: ${message.id}`)
        .setTimestamp(Date.now());
    if (message.attachments.first()) embed.addField(`Images/Fichiers`, message.attachments.map(e => `[${e.name}](${e.url})`).join("\n"));

    if (!latestMessageDeleted || (data.settings.latestMessageDeleted && data.settings.latestMessageDeleted?.id === latestMessageDeleted.id && data.settings.latestMessageDeleted?.extra.count === latestMessageDeleted.extra.count)) embed.setDescription(`${message.author} a supprimé son message dans ${message.channel} !`);
    else {
        embed.setDescription(`${latestMessageDeleted.executor} a supprimé le message de ${message.author} dans ${message.channel} !`);
        if (latestMessageDeleted) {
            data.settings.latestMessageDeleted = {extra: latestMessageDeleted.extra, id: latestMessageDeleted.id};
            await client.updateGuild(message.guild, data);
        };
    };
    return logChannel.send(embed);
};