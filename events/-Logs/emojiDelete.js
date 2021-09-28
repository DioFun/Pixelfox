const { MessageEmbed } = require("discord.js");
module.exports = async (client, emoji) => {
    if (!emoji.guild) return;
    let data = await client.getGuild(emoji.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = emoji.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await emoji.guild.fetchAuditLogs({
        limit: 1,
        type: "EMOJI_DELETE"
    });
    const latestEmojiDeleted = fetchGuildAuditLogs.entries.first();
    let embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`:wastebasket: Suppression d'un emoji`)
        .setDescription(`${latestEmojiDeleted.executor} a supprimé l'emoji \`${emoji.name}\` du serveur !`)
        .setFooter(`ID de l'emoji: ${emoji.id}`)
        .setTimestamp(latestEmojiDeleted.createdTimestamp);
    return logChannel.send(embed);
};