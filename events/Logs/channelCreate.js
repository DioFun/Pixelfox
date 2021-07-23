const { MessageEmbed } = require("discord.js");
module.exports = async (client, channel) => {
    if (!channel.guild) return;
    let data = await client.getGuild(channel.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = channel.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: "CHANNEL_CREATE"
    });
    const latestChannelCreated = fetchGuildAuditLogs.entries.first();
    let embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`<:blurple_plus:866955678257512469> Création de salon`)
        .setDescription(`${latestChannelCreated.executor} a créé le salon ${channel} !`)
        .addField("Type du salon", channel.type, true)
        .setFooter(`ID du salon: ${channel.id}`)
        .setTimestamp(channel.createdTimestamp);
    if (channel.parent) embed.addField("Catégorie", channel.parent.name, true);
    return logChannel.send(embed);
};