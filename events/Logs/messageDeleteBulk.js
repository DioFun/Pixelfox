const { MessageEmbed } = require("discord.js");
module.exports = async (client, messages) => {
    if (!messages.first()?.guild) return;
    let data = await client.getGuild(messages.first().guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = messages.first().guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;

    let fetchGuildAuditLogs = await messages.first().guild.fetchAuditLogs({
        limit: 1,
        type: "MESSAGE_BULK_DELETE"
    });
    const latestBulkDeletion = fetchGuildAuditLogs.entries.first();
    if (!latestBulkDeletion || latestBulkDeletion?.executor?.id === client.user.id) return;
    let embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`:wastebasket: Suppression de plusieurs messages`)
        .setDescription(`${latestBulkDeletion.executor} a supprimé ${messages.size} messages dans ${messages.first()?.channel}`)
        .setTimestamp(Date.now());
    return logChannel.send(embed);
};