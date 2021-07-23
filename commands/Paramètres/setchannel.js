const { BackMessage } = require("../../class/BackMessage");

module.exports.run = async (client, message, args, guild) => {
    if (args.length < 2 || !message.mentions.channels.first()) return new BackMessage("error", `Arguments Manquants !`);
    let channel = message.mentions.channels.first();
    switch (args[0].toLowerCase()) {
        case 'birthday':
            guild.settings.birthdayChannel = channel.id;
            client.updateGuild(message.guild, guild);
            return new BackMessage("success", `Le salon où seront souhaité les anniversaires est désormais ${channel} !`);
        case 'log':
            guild.settings.logChannel = channel.id;
            client.updateGuild(message.guild, guild);
            return new BackMessage("success", `Le salon de logs est désormais ${channel} !`);
        case 'welcome':
            guild.settings.welcomeChannel = channel.id;
            client.updateGuild(message.guild, guild);
            return new BackMessage("success", `Le salon où les nouveaux membres seront accueilli est désormais ${channel} !`);
    
        default:
            return new BackMessage("error", `Les arguments spécifiés sont invalides ou inexistants !`);
    }
};

module.exports.help = {
    name: "setchannel",
    aliases : ["setchannel"],
    category : 'paramètres',
    description: "Permet de modifier les channels de log, d'anniversaire ou d'arrivée",
    cooldown: 0,
    usage: "<[birthday,log,welcome]> <#salon>",
    args: true,
    permission: "admin",
};