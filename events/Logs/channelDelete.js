const { MessageEmbed } = require("discord.js");
module.exports = async (client, channel) => {
    if (!channel.guild) return;
    let data = await client.getGuild(channel.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = channel.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: "CHANNEL_DELETE"
    });
    const latestChannelDeleted = fetchGuildAuditLogs.entries.first();
    let embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`:wastebasket: Suppression de salon`)
        .setDescription(`${latestChannelDeleted.executor} a supprimé le salon ${channel.name} !`)
        .addField("Type du salon", channel.type, true)
        .setFooter(`ID du salon: ${channel.id}`)
        .setTimestamp(channel.createdTimestamp);
    if (channel.parent) embed.addField("Catégorie", channel.parent.name, true);
    return logChannel.send(embed);
};