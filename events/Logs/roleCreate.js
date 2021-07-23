const { MessageEmbed } = require("discord.js");
module.exports = async (client, role) => {
    if (!role.guild) return;
    let data = await client.getGuild(role.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = role.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await role.guild.fetchAuditLogs({
        limite: 1,
        type: "ROLE_CREATE"
    });
    const latestRoleCreated = fetchGuildAuditLogs.entries.first();
    let embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`<:blurple_plus:866955678257512469> Création d'un rôle`)
        .setDescription(`${latestRoleCreated.executor} a créé le rôle ${role} !`)
        .setFooter(`ID du rôle: ${role.id}`)
        .setTimestamp(role.createdTimestamp);
    return logChannel.send(embed);
};