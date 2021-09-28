const { MessageEmbed } = require("discord.js");
module.exports = async (client, reaction, user) => {
    if (reaction.message.author.bot) return;
    if (!reaction.message.guild) return;
    let data = await client.getGuild(reaction.message.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = reaction.message.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`:wastebasket: Suppression d'une réaction à un message`)
        .setDescription(`Une réaction de ${user} a été supprimée !`)
        .addField(`Message`, `[Lien](${reaction.message.url})`, true)
        .addField(`Nom de la réaction`, reaction.emoji.name, true)
        .setTimestamp(Date.now());
    return logChannel.send(embed);
};