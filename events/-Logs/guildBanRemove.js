const { MessageEmbed } = require("discord.js");
module.exports = async (client, guild, user) => {
    let dataGuild = await client.getGuild(guild);
    if (!dataGuild || !dataGuild?.settings?.logChannel) return;
    let logChannel = guild.channels.cache.find(e => e.id === dataGuild.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_BAN_REMOVE"
    });
    const latestBanRemoved = fetchGuildAuditLogs.entries.first();
    if (!latestBanRemoved || latestBanRemoved?.target?.id !== user.id || latestBanRemoved?.executor?.id === client.user.id) return;
    var embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`<:info:866955853160251411> Un ${user.bot ? `bot` : `membre`} a été débanni`)
        .setDescription(`${latestBanRemoved.executor} a débanni ${user.username} du serveur !`)
        .setFooter(`ID du ${user.bot ? `bot` : `membre`}: ${user.id}`)
        .setTimestamp(Date.now());

    return logChannel.send(embed);
};