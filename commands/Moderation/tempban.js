const { hasPermission } = require('../../tools/permissions.js');
const { StrToTime, TStoShortDate, TStoDate } = require('../../tools/date');

module.exports.run = async (client, message, args) => {

    let member = (message.mentions.members.first() || message.guild.members.cache.find(e => e.user.username.toLowerCase() === args[0].toLowerCase()));
    if(!member) return message.channel.send(":x: Vous n'avez pas spécifié de membre à bannir");
    if (member.user.bot) return message.channel.send(":x: Vous ne pouvez pas bannir un bot ! #ILoveMyFriends");
    
    if ((hasPermission(client, member, "staff") && !hasPermission(client, message.member, "admin")) || hasPermission(client, member, "admin")) return message.channel.send(":x: Vous n'avez pas la permission de bannir un membre du staff !");

    let time;
    try {
        time = Date.now()+StrToTime(args[1]);
    } catch(e) {
        return message.channel.send(`:x: Une erreur s'est produite ! \`${e}\` `);
    }
    let reason = args.slice(2).join(" ");

    try {
        if (!member.kickable) throw "Impossible de bannir cet utilisateur";
        await member.send(`Vous avez été bannis de ${message.guild.name} ${reason ? `pour \`${reason}\` ` : ""}jusqu'au ${TStoDate(time)} !`).catch(e => console.log(e));
        member.kick(`<tempban> ${message.author.tag} : ${reason} | fin: ${TStoShortDate(time)}`);
    } catch (e) {
        console.log(e);
        return message.channel.send(":x: Une erreur s'est produite lors du bannissement du membre ! Merci de contacter <@287559092724301824> !");
    }
    client.addInfraction(member, message.guild, "ban", reason, Date.now(), true, time);
    return message.channel.send(`:white_check_mark: L'utilisateur \`${member.user.username}\` a été bannis du serveur ${reason ? `pour \`${reason}\` ` : ""}jusqu'au ${TStoDate(time)} !`);
};

module.exports.help = {
    name: "tempban",
    aliases : ["tempban"],
    category : 'moderation',
    description: "Bannis pour une période donnée un membre du serveur",
    cooldown: 0,
    usage: "<@user> <duration_MSJHm> (reason)",
    args: true,
    permission: "modérateur",
};