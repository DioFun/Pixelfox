const { hasPermission } = require('../../tools/permissions.js');

module.exports.run = async (client, message, args, guild) => {

    let member = (message.mentions.members.first() || message.guild.members.cache.find(e => e.user.username.toLowerCase() === args[0].toLowerCase()));
    if(!member) return message.channel.send(":x: Vous n'avez pas spécifié d'utilisateur !");
    if ((hasPermission(client, member, "staff") && !hasPermission(client, message.member, "admin")) || hasPermission(client, member, "admin")) return message.channel.send(":x: Vous n'avez pas la permission d'effectuer cette action sur cette utilisateur !");

    let data = await client.getMember(member, message.guild);
    if (!data.infractions.find(e => e.type === "mute" && e.isActive)) return message.channel.send(":x: Cet utilisateur n'est pas réduit au silence !");

    let reason = data.infractions.find(inf => inf.isActive && inf.type === "mute").reason;
    
    data.infractions.find(inf => inf.isActive && inf.type === "mute").isActive = false;
    await client.updateMember(member, message.guild, data);

    member.roles.remove(message.channel.guild.roles.cache.get(guild.settings.muteRoleID));

    member.send(`Votre sanction de réduction au silence ${reason ? `pour ${reason} `: ``}a été levée !`);
    return message.channel.send(`:white_check_mark: La sanction de réduction au silence de ${member} ${reason ? `pour ${reason} `: ``}a été levée !`);

};

module.exports.help = {
    name: "unmute",
    aliases : ["unmute"],
    category : 'moderation',
    description: "Annule la réduction au silence d'un utilisateur ! Ne la supprime pas de son casier !",
    cooldown: 0,
    usage: "<@user>",
    args: true,
    permission: "modérateur",
};