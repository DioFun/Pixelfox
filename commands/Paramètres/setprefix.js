const { BackMessage } = require("../../class/BackMessage");

module.exports.run = async (client, message, args, guild) => {
    let newprefix = args[0].toLowerCase();
    if(!newprefix) return new BackMessage("error", `Vous n'avez pas spécifié de préfixe !`);
    guild.settings.prefix = newprefix;
    await client.updateGuild(message.guild, guild);

    return new BackMessage("success", `Le préfixe du serveur a bien été changé pour \`${newprefix}\` !`);
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

