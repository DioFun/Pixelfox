const { MessageEmbed } = require('discord.js');
const { BackMessage } = require('../../class/BackMessage.js');
const { hasPermission } = require('../../tools/permissions.js');

module.exports.run = async (client, message, args, guild) => {
    let member = (message.mentions.members.first() || message.guild.members.cache.find(e => e.user.username.toLowerCase() === args[0].toLowerCase()));
    let reason = args.slice(1).join(" ");

    if(!member) return  new BackMessage("error", `Vous n'avez pas spécifié de membre à avertir`);
    if ((hasPermission(client, member, "staff") && !hasPermission(client, message.member, "admin")) || hasPermission(client, member, "admin")) return new BackMessage("error", `Vous n'avez pas la permission d'avertir un membre du staff !`);

    client.addInfraction(member, message.guild, "warn", reason);
    let logChannel = message.guild.channels.cache.get(guild.settings.logChannel);
    if (logChannel) {
        let embed = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`:pencil: Avertissement`)
            .setDescription(`${message.author} a averti ${member} !`)
            .setFooter(`ID du membre : ${member.id}`)
            .setTimestamp(Date.now());
        if (reason) embed.addField(`Raison`, reason, true);
        logChannel.send(embed);
    };
    member.send(`Vous avez reçu un avertissement sur ${message.guild.name} ${reason ? `pour \`${reason}\`` : ""} !`).catch(e => console.log(e));
    return new BackMessage("success", `L'utilisateur \`${member.user.username}\` a reçu un avertissement ${reason ? `pour \`${reason}\`` : ""} !`);

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