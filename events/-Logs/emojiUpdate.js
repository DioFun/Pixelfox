const { MessageEmbed } = require("discord.js");
module.exports = async (client, oldEmoji, newEmoji) => {
    if (!newEmoji.guild) return;
    let data = await client.getGuild(newEmoji.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = newEmoji.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await newEmoji.guild.fetchAuditLogs({
        limit: 1,
        type: "EMOJI_UPDATE"
    });
    const latestEmojiUpdated = fetchGuildAuditLogs.entries.first();
    let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`:pencil2: Modification d'un emoji`)
        .setDescription(`${latestEmojiUpdated.executor} a modifié l'emoji ${newEmoji} !`)
        .addField(`Ancien nom`, oldEmoji.name, true)
        .addField(`Nouveau nom`, newEmoji.name, true)
        .setFooter(`ID de l'emoji: ${newEmoji.id}`)
        .setTimestamp(latestEmojiUpdated.createdTimestamp);
    return logChannel.send(embed);
};