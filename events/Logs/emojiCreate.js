const { MessageEmbed } = require("discord.js");
module.exports = async (client, emoji) => {
    console.log(emoji);
    if (!emoji.guild) return;
    let data = await client.getGuild(emoji.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = emoji.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await emoji.guild.fetchAuditLogs({
        limit: 1,
        type: "EMOJI_CREATE"
    });
    const latestEmojiCreated = fetchGuildAuditLogs.entries.first();
    let embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`<:blurple_plus:866955678257512469> Ajout d'un emoji`)
        .setDescription(`${latestEmojiCreated.executor} a ajouté l'emoji ${emoji} au serveur !`)
        .setFooter(`ID de l'emoji: ${emoji.id}`)
        .setThumbnail(emoji.url)
        .setTimestamp(emoji.createdTimestamp);
    return logChannel.send(embed);
};