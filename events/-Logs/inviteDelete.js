const { MessageEmbed } = require("discord.js");
module.exports = async (client, invite) => {
    if (!invite.guild) return;
    let data = await client.getGuild(invite.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = invite.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await invite.guild.fetchAuditLogs({
        limite: 1,
        type: "INVITE_DELETE"
    });
    const latestInviteDeleted = fetchGuildAuditLogs.entries.first();
    let embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`:wastebasket: Suppression d'une invitation`)
        .setDescription(`${latestInviteDeleted.executor} a supprimé une invitation du serveur pour le salon ${invite.channel} !`)
        .setFooter(`Lien de l'invitation: ${invite.url}`)
        .setTimestamp(Date.now());
    return logChannel.send(embed);
};