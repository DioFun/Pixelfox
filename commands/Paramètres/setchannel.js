module.exports.run = (client, message, args, guild) => {
    if (args.length < 2 || !message.mentions.channels.first()) return message.channel.send(`:x: Vous n'avez pas renségné assez d'arguments ! Utilisation de la commande : \`${client.settings.prefix}${this.help.name} ${this.help.usage}\``);
    let channel = message.mentions.channels.first();
    switch (args[0].toLowerCase()) {
        case 'birthday':
            guild.settings.birthdayChannel = channel.id;
            client.updateGuild(message.guild, guild);
            return message.channel.send(`:white_check_mark: Le salon où seront souhaité les anniversaires est désormais ${channel} !`);
        case 'log':
            guild.settings.logChannel = channel.id;
            client.updateGuild(message.guild, guild);
            return message.channel.send(`:white_check_mark: Le salon de logs est désormais ${channel} !`);
        case 'welcome':
            guild.settings.welcomeChannel = channel.id;
            client.updateGuild(message.guild, guild);
            return message.channel.send(`:white_check_mark: Le salon où les nouveaux membres seront accueillis est désormais ${channel} !`);
    
        default:
            return message.channel.send(`Les arguments spécifiés sont invalides ou inexistants. Utilisation de la commande : \`${client.settings.prefix}${this.help.name} ${this.help.usage}\``);
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