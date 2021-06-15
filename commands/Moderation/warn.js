const { hasPermission } = require('../../tools/permissions.js');

module.exports.run = (client, message, args) => {

    let member = (message.mentions.members.first() || message.guild.members.cache.find(e => e.user.username.toLowerCase() === args[0].toLowerCase()));
    let reason = args.slice(1).join(" ");

    if(!member) return message.channel.send(":x: Vous n'avez pas spécifié de membre à avertir");
    if ((hasPermission(client, member, "staff") && !hasPermission(client, message.member, "admin")) || hasPermission(client, member, "admin")) return message.channel.send(":x: Vous n'avez pas la permission d'avertir un membre du staff !");

    client.addInfraction(member, message.guild, "warn", reason);
    member.send(`Vous avez reçu un avertissement sur ${message.guild.name} ${reason ? `pour \`${reason}\`` : ""} !`).catch(e => console.log(e));
    return message.channel.send(`:white_check_mark: L'utilisateur \`${member.user.username}\` a reçu un avertissement ${reason ? `pour \`${reason}\`` : ""} !`);

};

module.exports.help = {
    name: "warn",
    aliases : ["warn"],
    category : 'moderation',
    description: "Avertis un utilisateur",
    cooldown: 0,
    usage: "<@user> (reason)",
    args: true,
    permission: "staff",
};