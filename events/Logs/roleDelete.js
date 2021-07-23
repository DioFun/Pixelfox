const { MessageEmbed } = require("discord.js");
module.exports = async (client, role) => {
    if (!role.guild) return;
    let data = await client.getGuild(role.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = role.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await role.guild.fetchAuditLogs({
        limite: 1,
        type: "ROLE_DELETE"
    });
    const latestRoleDeleted = fetchGuildAuditLogs.entries.first();
    let embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`:wastebasket: Suppression d'un rôle`)
        .setDescription(`${latestRoleDeleted.executor} a supprimé le rôle \`${role.name}\` !`)
        .setFooter(`ID du rôle: ${role.id}`)
        .setTimestamp(latestRoleDeleted.createdTimestamp);
    return logChannel.send(embed);
};