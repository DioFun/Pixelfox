const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, guild) => {
    let member = message.mentions.members.first() || message.guild.members.cache.find(e => e.id === args[0] || e.user.username.toLowerCase() === args[0]?.toLowerCase() || e.displayName.toLowerCase().includes(args[0]?.toLowerCase())) || message.member;
    let data = await client.getMember(member, member.guild);
    let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`Niveau de ${member.nickname ? member.nickname : member.user.username}`)
        .addField(`Niveau`, data.level, true)
        .addField(`Points d'expérience`, data.experience, true)
        .addField(`Nombres de messages`, data.messages, true)
        .setThumbnail(member.user.avatarURL());
    return message.channel.send(embed);
};

module.exports.help = {
    name: "rank",
    aliases : ["rk", "level", "lvl"],
    category : 'expérience',
    description: "Permet d'afficher le niveau d'un membre",
    cooldown: 0,
    usage: "(@member)",
    args: false,
    permission: false,
};