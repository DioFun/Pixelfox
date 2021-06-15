module.exports.run = (client, message, args, guild) => {
    let newCd = parseInt(args[0]);
    if (!newCd) return message.channel.send(':x: Vous devez spécifier un entier valide !');
    guild.settings.cooldown = newCd;
    client.updateGuild(message.guild, guild);

    return message.channel.send(`:white_check_mark: Le cooldown par défaut des commandes a bien été changé pour \`${newCd}\` secondes.`);
};

module.exports.help = {
    name: "setcooldown",
    aliases : ["setcd", "sdc"],
    category : 'paramètres',
    description: "Modifie le cooldown par défaut des commandes",
    cooldown: 0,
    usage: "<new_default_cooldown>",
    args: true,
    permission: "admin",
};
