const { MessageEmbed } = require("discord.js");
module.exports = async (client, guild, user) => {
    let dataGuild = await client.getGuild(guild);
    if (!dataGuild || !dataGuild?.settings?.logChannel) return;
    let logChannel = guild.channels.cache.find(e => e.id === dataGuild.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_BAN_ADD"
    });
    const latestBanMember = fetchGuildAuditLogs.entries.first();
    if (!latestBanMember || latestBanMember?.target?.id !== user.id || latestBanMember?.executor?.id === client.user.id) return;
    var embed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle(`<:arrow_leave:866959272382169088> Bannissement`)
        .setDescription(`${latestBanMember.executor} a banni ${user.username} du serveur !`)
        .setFooter(`ID du ${user.bot ? `bot` : `membre`}: ${user.id}`)
        .setTimestamp(Date.now());

    if (latestBanMember.reason) embed.addField(`Raison`, latestBanMember.reason);

    return logChannel.send(embed);
};