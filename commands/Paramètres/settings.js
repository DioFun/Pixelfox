const { MessageEmbed } = require("discord.js");
const { BackMessage } = require("../../class/BackMessage");

module.exports.run = (client, message, args, guild) => {
    let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`:tools: Paramètres de ${message.guild.name}`)
        .setDescription(`\`préfixe\` ${guild.settings.prefix}\n\`Salon de logs\` ${guild.settings.logChannel === "" ? `Non définis` : `<#${guild.settings.logChannel}>`}\n\`Salon d'anniversaires\` ${guild.settings.birthdayChannel === "" ? `Non définis` : `<#${guild.settings.birthdayChannel}>`}\n\`Salon de bienvenue\` ${guild.settings.welcomeChannel === "" ? `Non définis` : `<#${guild.settings.welcomeChannel}>`}\n\`Role de mute\` ${guild.settings.muteRoleID === "" ? `Non définis` : `<@&${guild.settings.muteRoleID}>`}\n\`Cooldown par défaut\` ${guild.settings.cooldown}\n\`Statut des tâches récurrentes\` ${guild.settings.cronState ? `Actif` : `Inactif`}\n\`Nombre de tâches récurrentes\` ${guild.settings.crons.length}`);

    return new BackMessage("custom", embed);
};

module.exports.help = {
    name: "settings",
    aliases : ["parameters", "params"],
    category : 'paramètres',
    description: "Affiche les paramètres du serveur",
    cooldown: 0,
    usage: "",
    args: false,
    permission: "modérateur",
};