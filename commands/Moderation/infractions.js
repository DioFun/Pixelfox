const { MessageEmbed } = require('discord.js');
const { TStoShortDate } = require('../../tools/date.js');
const { hasPermission } = require('../../tools/permissions.js');

module.exports.run = async (client, message, args) => {

    let member = (message.mentions.members.first() || message.guild.members.cache.find(e => e.user.username.toLowerCase() === args[0].toLowerCase()));
    if(!member) return message.channel.send(":x: Vous n'avez pas spécifié d'utilisateur !");
    let memberData = await client.getMember(member, message.guild);
    const locker = memberData.infractions;

    if (args[1] && args[1].toLowerCase() === "clear" && hasPermission(client, message.member, "admin")) {
        if (locker.length === 0) return message.channel.send(`:x: ${member} n'a aucune infraction !`);

        memberData.infractions = [];
        await client.updateMember(member, message.guild, memberData);

        return message.channel.send(`:white_check_mark: Les infractions de ${member} ont été supprimées !`);

    } else {

        let lastInfractions = locker.length >= 10 ? locker.slice(locker.length-10, locker.length) : locker
        
        let embed = new MessageEmbed()
            .setTitle(`Infractions de ${member.user.tag}`)
            .setColor("ORANGE")
            .setThumbnail(member.user.avatarURL())
            .addFields([
                {name: `Total`, value: locker.length, inline: true},
                {name: `Bannissements`, value: locker.filter(e => e.type === "ban").length, inline: true},
                {name: `Avertissements`, value: locker.filter(e => e.type === "warn").length, inline: true},
                {name: `Réductions au silence`, value: locker.filter(e => e.type === "mute").length, inline: true},
                {name: `Expulsions`, value: locker.filter(e => e.type === "kick").length, inline: true},
                {name: `Dernières Infractions`, value: lastInfractions.length ? lastInfractions.map(e => `**${e.type}** : ${e.reason} - ${TStoShortDate(e.date)}`) : `Aucune infraction`}
            ])

        return message.channel.send(embed);

    }
    
};

module.exports.help = {
    name: "infractions",
    aliases : ["infractions"],
    category : 'moderation',
    description: "Affiche les infractions de l'utilisateur mentionné. Permet aux admins de supprimer l'entièreté du casier d'un utilisateur.",
    cooldown: 0,
    usage: "<@user> ([clear])",
    args: true,
    permission: "staff",
};