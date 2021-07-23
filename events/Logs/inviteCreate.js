const { MessageEmbed } = require("discord.js");
const { TStoShortDate } = require("../../tools/date");
module.exports = async (client, invite) => {
    if (!invite.guild) return;
    let data = await client.getGuild(invite.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = invite.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`<:blurple_plus:866955678257512469> Création d'une invitation`)
        .setDescription(`${invite.inviter} a créé une invitation au serveur pour le salon ${invite.channel} !`)
        .addFields([
            {name: `Création`, value: `le ${TStoShortDate(invite.createdAt)}`, inline: true},
            {name: `Expiration`, value: invite.expiresAt ? `le ${TStoShortDate(invite.expiresAt)}` : `Jamais`, inline: true},
            {name: `Utilisations max`, value: invite.maxUses ? invite.maxUses : `Illimité`, inline: true}
        ])
        .setFooter(`Lien de l'invitation: ${invite.url}`)
        .setTimestamp(invite.createdTimestamp);
    return logChannel.send(embed);
};