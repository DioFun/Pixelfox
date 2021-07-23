const { MessageEmbed } = require('discord.js');
const { BackMessage } = require('../../class/BackMessage.js');
const { hasPermission } = require('../../tools/permissions.js');

module.exports.run = async (client, message, args, guild) => {

    let member = (message.mentions.members.first() || message.guild.members.cache.find(e => e.user.username.toLowerCase() === args[0].toLowerCase()));
    let reason = args.slice(1).join(" ");

    if(!member) return new BackMessage("error", `Vous n'avez pas spécifié de membre à exclure !`);
    if ((hasPermission(client, member, "staff") && !hasPermission(client, message.member, "admin")) || hasPermission(client, member, "admin")) return new BackMessage("error", `Vous n'avez pas la permission d'expulser un membre du staff !`);

    try {
        if (!member.kickable) throw "Impossible d'epulser cet utilisateur";
        await member.send(`Vous avez été expulsé de ${message.guild.name} ${reason ? `pour \`${reason}\`` : ""} !`).catch(e => console.log(e));
        member.kick(`${message.author.tag} > ${reason}`);
    } catch (e) {
        console.log(e);
        return new BackMessage("warning", `Une erreur s'est produite lors de l'expulsion du membre ! Merci de contacter <@287559092724301824> !`);
    }
    client.addInfraction(member, message.guild, "kick", reason);
    let logChannel = message.guild.channels.cache.get(guild.settings.logChannel);
    if (logChannel) {
        var embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`<:arrow_leave:866959272382169088> Expulsion`)
            .setDescription(`${message.member} a expulsé ${member.user.username} du serveur !`)
            .setFooter(`ID du ${member.user.bot ? `bot` : `membre`}: ${member.id}`)
            .setTimestamp(Date.now());
        if (reason) embed.addField(`Raison`, reason);
        logChannel.send(embed);
    };
    return new BackMessage("success", `L'utilisateur \`${member.user.username}\` a été exclu du serveur ${reason ? `pour \`${reason}\`` : ""} !`);
};

module.exports.help = {
    name: "kick",
    aliases : ["kick"],
    category : 'moderation',
    description: "Expulse un membre du serveur",
    cooldown: 0,
    usage: "<@user> (reason)",
    args: true,
    permission: "modérateur",
};