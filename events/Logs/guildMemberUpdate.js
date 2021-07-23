const { MessageEmbed } = require("discord.js");
module.exports = async (client, oldMember, newMember) => {
    if (!newMember.guild || oldMember === newMember) return;
    let data = await client.getGuild(newMember.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = newMember.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;

    let edited = {};
    for (const key in oldMember) {
        if (oldMember[key] !== newMember[key]) edited[key] = newMember[key];
    };

    let fetchGuildAuditLogs = await oldMember.guild.fetchAuditLogs({
        limit: 1
    });
    const latestMemberUpdated = fetchGuildAuditLogs.entries.first();
    if (latestMemberUpdated.target.id !== newMember.id) return;
    let embed = new MessageEmbed()
        .setTitle(`:pencil2: Modification d'un membre`)
        .setColor("ORANGE")
        .setFooter(`ID du membre: ${newMember.id}`)
        .setTimestamp(latestMemberUpdated.createdTimestamp);

    switch (latestMemberUpdated.action) {
        case "MEMBER_UPDATE":
            if (oldMember.nickname === newMember.nickname) return logChannel.send(`<:prohibited:866955746754953237> Une opération a eu lieu sur le membre ${newMember} mais n'a pas pu être enregistrée !`);
            var description = `${newMember} a changé de pseudo !`;
            embed.addFields([
                {name: `Ancien pseudo`, value: oldMember.displayName, inline: true},
                {name: `Nouveau pseudo`, value: newMember.displayName, inline: true}
            ]);
            break;

        case "MEMBER_ROLE_UPDATE":
            var description = `${latestMemberUpdated.executor} a changé les rôles de ${newMember} !`;
            if (latestMemberUpdated.changes.find(e => e.key === "$add")) {
                embed.addField(latestMemberUpdated.changes.find(e => e.key === "$add").new.length > 1 ? `Rôles ajoutés` : `Rôle ajouté`, latestMemberUpdated.changes.find(e => e.key === "$add").new.map(e => `<@&${e.id}>`).join("\n"));
            };
            if (latestMemberUpdated.changes.find(e => e.key === "$remove")) {
                embed.addField(latestMemberUpdated.changes.find(e => e.key === "$remove").new.length > 1 ? `Rôles supprimés` : `Rôle supprimé`, latestMemberUpdated.changes.find(e => e.key === "$remove").new.map(e => `<@&${e.id}>`).join("\n"));
            };
            break;

        default:
            return logChannel.send(`<:prohibited:866955746754953237> Une opération a eu lieu sur le membre ${newMember} mais n'a pas pu être enregistrée !`);
    }
    embed.setDescription(description);
    return logChannel.send(embed);
};