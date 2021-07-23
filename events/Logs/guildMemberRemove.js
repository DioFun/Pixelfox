const { MessageEmbed } = require("discord.js");
module.exports = async (client, member) => {
    if (!member.guild) return;
    let dataGuild = await client.getGuild(member.guild);
    if (!dataGuild || !dataGuild?.settings?.logChannel) return;
    let logChannel = member.guild.channels.cache.find(e => e.id === dataGuild.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_KICK"
    });
    const latestKickMember = fetchGuildAuditLogs.entries.first();

    if (latestKickMember && latestKickMember?.target?.id === member.id && latestKickMember?.executor?.id !== client.user.id) {
        var embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`<:arrow_leave:866959272382169088> Expulsion`)
            .setDescription(`${latestKickMember.executor} a expulsé ${member.user.username} du serveur !`)
            .setFooter(`ID du ${member.user.bot ? `bot` : `membre`}: ${member.id}`)
            .setTimestamp(Date.now());
    } else if (!latestKickMember || latestKickMember?.target?.id !== member.id) {
        var embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`<:arrow_leave:866959272382169088> Un ${member.user.bot ? `bot` : `membre`} nous a quitté`)
            .setDescription(`${member.user.username} a quitté le serveur !`)
            .setFooter(`ID du ${member.user.bot ? `bot` : `membre`}: ${member.id}`)
            .setTimestamp(Date.now());
    } else {
        return;
    }

    return logChannel.send(embed);
};