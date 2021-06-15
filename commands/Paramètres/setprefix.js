module.exports.run = (client, message, args, guild) => {
    let newprefix = args[0].toLowerCase();
    if(!newprefix) return message.channel.send(':x: Vous n\'avez pas spécifié de préfixe !');
    guild.settings.prefix = newprefix;
    client.updateGuild(message.guild, guild);

    return message.channel.send(`:white_check_mark: Le préfixe du serveur a bien été changé pour \`${newprefix}\` `);
};

module.exports.help = {
    name: "setprefix",
    aliases : ["setpre", "sp"],
    category : 'paramètres',
    description: "Change le préfixe du bot",
    cooldown: 0,
    usage: "<new_prefix>",
    args: true,
    permission: "admin",
};

