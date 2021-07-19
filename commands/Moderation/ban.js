const { BackMessage } = require('../../class/BackMessage.js');
const guild = require('../../models/guild.js');
const { hasPermission } = require('../../tools/permissions.js');

module.exports.run = async (client, message, args) => {

    let member = (message.mentions.members.first() || message.guild.members.cache.find(e => e.user.username.toLowerCase() === args[0].toLowerCase()));
    if (member?.user?.bot) return new BackMessage("warning", `Vous ne pouvez pas bannir un bot ! #ILoveMyFriends`);
    let reason = args.slice(1).join(" ");

    if(!member) return new BackMessage("error", `Vous n'avez pas spécifié de membre à bannir !`);
    if ((hasPermission(client, member, "staff") && (!hasPermission(client, message.member, "admin") || !message.member.roles.cache.has("714789777530159164"))) || hasPermission(client, member, "admin")) return message.channel.send(":x: Vous n'avez pas la permission de bannir un membre du staff !");

    try {
        if (!member.bannable) throw "Impossible de bannir cet utilisateur";
        await member.send(`Vous avez été banni de ${message.guild.name} ${reason ? `pour \`${reason}\`` : ""} !`).catch(e => console.log(e));
        member.ban({reason: `${message.author.tag} ${reason}`});
    } catch (e) {
        console.log(e);
        return new BackMessage("warning", `Une erreur s'est produite lors du bannissement du membre ! Merci de contacter <@287559092724301824> !`);
    }
    client.addInfraction(member, message.guild, "ban", reason);
    return new BackMessage("success", `L'utilisateur \`${member.user.username}\` a été banni du serveur ${reason ? `pour \`${reason}\`` : ""} !`);
};

module.exports.help = {
    name: "ban",
    aliases : ["ban"],
    category : 'moderation',
    description: "Bannis définitivement un membre du serveur",
    cooldown: 0,
    usage: "<@user> (reason)",
    args: true,
    permission: "modérateur",
};