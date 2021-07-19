const { get } = require('mongoose');
const { BackMessage } = require('../../class/BackMessage.js');
const { StrToTime, TStoDate } = require('../../tools/date.js');
const { hasPermission } = require('../../tools/permissions.js');

module.exports.run = async (client, message, args, guild) => {

    let member = (message.mentions.members.first() || message.guild.members.cache.find(e => e.user.username.toLowerCase() === args[0].toLowerCase()));
    if(!member) return new BackMessage("error", `Vous n'avez pas spécifié de membre à réduire au silence !`);
    if (member.user.bot) return new BackMessage("error", `Vous ne pouvez pas réduire au silence un bot ! #ILoveMyFriends`);
    if ((hasPermission(client, member, "staff") && !hasPermission(client, message.member, "admin")) || hasPermission(client, member, "admin")) return new BackMessage("error", `Vous n'avez pas la permission de réduire au silence un membre du staff !`);

    let data = await client.getMember(member, message.guild);
    if (data.infractions.find(e => e.type === "mute" && e.isActive)) return new BackMessage("error", `Cet utilisateur est déjà réduit au silence !`);

    let time;
    try {
        time = Date.now()+StrToTime(args[1]);
    } catch(e) {
        return new BackMessage("warning", `Une erreur s'est produite ! \`${e}\` `);
    }
    let reason = args.slice(2).join(" ");

    client.addInfraction(member, message.guild, "mute", reason, Date.now(), true, time);

    member.roles.add(message.channel.guild.roles.cache.get(guild.settings.muteRoleID));

    member.send(`Vous avez été réduit au silence sur ${message.guild.name} ${reason ? `pour \`${reason}\` ` : ""}jusqu'au ${TStoDate(time)} !`);

    let backMessage = new BackMessage("success", `L'utilisateur \`${member.user.username}\` a été réduit au silence ${reason ? `pour \`${reason}\` ` : ""}jusqu'au ${TStoDate(time)} !`);
    backMessage.send(message.channel, guild, this);

    setTimeout(async () => {
        data = await client.getMember(member, message.guild);
        if (data.infractions.find(inf => inf.isActive && inf.type === "mute")) {
            data.infractions.find(inf => inf.isActive && inf.type === "mute").isActive = false;
            await client.updateMember(member, message.guild, data);
            member.roles.remove(message.channel.guild.roles.cache.get(guild.settings.muteRoleID));
        }
    }, StrToTime(args[1]));
    return;

};

module.exports.help = {
    name: "mute",
    aliases : ["mute"],
    category : 'moderation',
    description: "Réduit au silence un utilisateur pour une période donnée",
    cooldown: 0,
    usage: "<@user> <duration_MSJHm> (reason)",
    args: true,
    permission: "modérateur",
};