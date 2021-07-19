const { BackMessage } = require("../../class/BackMessage");

module.exports.run = async (client, message, args) => {

    let data = await client.getMemberByUsername(args.join(" "), message.guild);
    if(!data) return new BackMessage("error", `Vous n'avez pas spécifié d'utilisateur !`);

    if (!data.infractions.find(e => e.type === "ban" && e.isActive)) return new BackMessage("error", `Cet utilisateur n'est pas banni !`);

    if (data.infractions.find(e => e.type === "ban" && e.isActive).end === 0) {
        message.guild.members.unban(data.userID)
    }

    let reason = data.infractions.find(inf => inf.isActive && inf.type === "ban").reason;
    
    data.infractions.find(inf => inf.isActive && inf.type === "ban").isActive = false;
    client.updateMember(data, message.guild, data);

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