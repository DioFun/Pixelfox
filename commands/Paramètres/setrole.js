module.exports.run = (client, message, args, guild) => {
    if (args.length < 2 || !message.mentions.roles.first()) return message.channel.send(`:x: Vous n'avez pas renségné assez d'arguments ! Utilisation de la commande : \`${client.settings.prefix}${this.help.name} ${this.help.usage}\``);
    let role = message.mentions.roles.first();
    switch (args[0].toLowerCase()) {
        case 'mute':
            guild.settings.muteRoleID = role.id;
            client.updateGuild(message.guild, guild);
            return message.channel.send(`:white_check_mark: Le role de réduction au silence est désormais ${role} !`);
    
        default:
            return message.channel.send(`Les arguments spécifiés sont invalides ou inexistants. Utilisation de la commande : \`${client.settings.prefix}${this.help.name} ${this.help.usage}\``);
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