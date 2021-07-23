const { hasPermission } = require('../../tools/permissions.js');
const { StrToTime, TStoShortDate, TStoDate } = require('../../tools/date');
const { BackMessage } = require('../../class/BackMessage.js');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, guild) => {

    let member = (message.mentions.members.first() || message.guild.members.cache.find(e => e.user.username.toLowerCase() === args[0].toLowerCase()));
    if(!member) return new BackMessage("error", `Vous n'avez pas spécifié de membre à bannir`);
    if (member.user.bot) return new BackMessage("error", `Vous ne pouvez pas bannir un bot ! #ILoveMyFriends`);
    
    if ((hasPermission(client, member, "staff") && !hasPermission(client, message.member, "admin")) || hasPermission(client, member, "admin")) return new BackMessage("error", `Vous n'avez pas la permission de bannir un membre du staff !`);

    let time;
    try {
        time = Date.now()+StrToTime(args[1]);
    } catch(e) {
        return new BackMessage("warning", `Une erreur s'est produite ! \`${e}\``);
    }
    let reason = args.slice(2).join(" ");

    try {
        if (!member.kickable) throw "Impossible de bannir cet utilisateur";
        await member.send(`Vous avez été bannis de ${message.guild.name} ${reason ? `pour \`${reason}\` ` : ""}jusqu'au ${TStoDate(time)} !`).catch(e => console.log(e));
        member.kick(`<tempban> ${message.author.tag} : ${reason} | fin: ${TStoShortDate(time)}`);
    } catch (e) {
        console.log(e);
        return new BackMessage("warning", `Une erreur s'est produite lors du bannissement du membre ! Merci de contacter <@287559092724301824> !`);
    }
    client.addInfraction(member, message.guild, "ban", reason, Date.now(), true, time);
    let logChannel = message.guild.channels.cache.get(guild.settings.logChannel);
    if (logChannel) {
        let embed = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`<:arrow_leave:866959272382169088> Bannissement Temporaire`)
            .setDescription(`${message.author} a banni temporairement ${member.user.tag} du serveur !`)
            .setFooter(`ID du membre : ${member.id}`)
            .setTimestamp(Date.now());
        if (reason) embed.addField(`Raison`, reason);
        embed.addField(`Fin`, TStoDate(time));
        logChannel.send(embed);
    };
    return new BackMessage("success", `L'utilisateur \`${member.user.username}\` a été bannis du serveur ${reason ? `pour \`${reason}\` ` : ""}jusqu'au ${TStoDate(time)} !`);
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