const { MessageEmbed } = require("discord.js");
const { TStoShortDate } = require("../../tools/date");
module.exports = async (client, oldMessage, newMessage) => {
    if (!newMessage.guild) return;
    let data = await client.getGuild(newMessage.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = newMessage.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;

    let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`:pencil2: Edition d'un message`)
        .setDescription(`${newMessage.author} a modifié son [message](${newMessage.url}) dans ${newMessage.channel}`)
        .addField(`Publication`, TStoShortDate(newMessage.createdAt), true)
        .setFooter(`ID du message: ${newMessage.id}`)
        .setTimestamp(newMessage.editedTimestamp);

    if (oldMessage.content !== newMessage.content) embed.addFields([
        {name: "Ancien contenu", value: oldMessage.content ? oldMessage.content : `Pas de contenu`, inline: true},
        {name: "Nouveau contenu", value: newMessage.content ? newMessage.content : `Pas de contenu`, inline: true}
    ]);
    if (oldMessage.attachments.difference(newMessage.attachments).size) embed.addFields([
        {name: "Ancien/nes Fichiers ou Images", value: oldMessage.attachments.first() ? oldMessage.attachments.map(e => `[${e.name}](${e.url})`).join("\n") : `Pas d'images ou fichiers`, inline: true},
        {name: "Nouveau/elle Fichiers ou Images", value: newMessage.attachments.first() ? newMessage.attachments.map(e => `[${e.name}](${e.url})`).join("\n") : `Pas d'images ou fichiers`, inline: true}
    ]);
    if (!(oldMessage.content !== newMessage.content) && !oldMessage.attachments.difference(newMessage.attachments).size) return;

    return logChannel.send(embed);
};