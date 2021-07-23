const { MessageEmbed } = require("discord.js");
const { BackMessage } = require("../../class/BackMessage");

module.exports.run = async (client, message, args, guild) => {
    let data = await client.getMember({id: args[0]}, message.guild);
    if(!data) return new BackMessage("error", `Vous n'avez pas spécifié d'utilisateur !`);

    if (!data.infractions.find(e => e.type === "ban" && e.isActive)) return new BackMessage("error", `Cet utilisateur n'est pas banni !`);

    if (data.infractions.find(e => e.type === "ban" && e.isActive).end === 0) {
        message.guild.members.unban(data.userID);
    };

    let reason = data.infractions.find(inf => inf.isActive && inf.type === "ban").reason;
    
    data.infractions.find(inf => inf.isActive && inf.type === "ban").isActive = false;
    client.updateMember(data, message.guild, data);

    let logChannel = message.guild.channels.cache.get(guild.settings.logChannel);
    if (logChannel) {
        let fetchGuildAuditLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_BAN_REMOVE"
        });
        const latestBanRemoved = fetchGuildAuditLogs.entries.first();
        const target = latestBanRemoved.target;
        let embed = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`<:info:866955853160251411> Un ${target.bot ? `bot` : `membre`} a été débanni`)
        .setDescription(`${message.author} a débanni ${target.username} du serveur !`)
        .setTimestamp(latestBanRemoved.createdAt);
        if (reason) embed.addField(`Raison`, reason);
        logChannel.send(embed);
    }; 

    //member.send(`Votre sanction de bannissement ${reason ? `pour ${reason} `: ``}a été levée !`);
    return new BackMessage("success", `Le bannissement de ${data.username} ${reason ? `pour \`${reason}\` `: ``}a été levé !`);

};

module.exports.help = {
    name: "unban",
    aliases : ["unban"],
    category : 'moderation',
    description: "Annule le bannissement d'un utilisateur ! Ne la supprime pas de son casier !",
    cooldown: 0,
    usage: "<@user>",
    args: true,
    permission: "modérateur",
};