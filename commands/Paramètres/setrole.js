const { BackMessage } = require("../../class/BackMessage");

module.exports.run = async (client, message, args, guild) => {
    if (args.length < 2 || !message.mentions.roles.first()) return new BackMessage("error", `Arguments Manquants !`);
    let role = message.mentions.roles.first();
    switch (args[0].toLowerCase()) {
        case 'mute':
            guild.settings.muteRoleID = role.id;
            await client.updateGuild(message.guild, guild);
            return new BackMessage("success", `Le role de réduction au silence est désormais ${role} !`);
    
        default:
            return new BackMessage("error", `Les arguments spécifiés sont invalides ou inexistants !`);
    }
};

module.exports.help = {
    name: "setrole",
    aliases : ["setrole"],
    category : 'paramètres',
    description: "Permet de changer le role de réduction au silence et autre par la suite",
    cooldown: 0,
    usage: "<[mute]> <@role>",
    args: true,
    permission: "admin",
};