const { MessageEmbed } = require("discord.js");
const { BackMessage } = require("../../class/BackMessage");

module.exports.run = async (client, message, args, guild) => {
    if (guild.settings.logChannel && message.channel.id === guild.settings.logChannel) return new BackMessage("error", `Vous ne pouvez pas supprimé des logs !`);
    let number = Number.parseInt(args[0])+1;
    if (number > 100) return new BackMessage("error", `Impossible de supprimer autant de messages !`);

    try {
        message.channel.bulkDelete(number)
            .then(messages => {
                message.channel.send(`:white_check_mark: \`${messages.size-1}\` messages ont été supprimés !`)
                    .then(e => setTimeout(() => e.delete(), 5000));
            });
    } catch (e) {
        console.log(e);
        return new BackMessage("warning", `Une erreur s'est produite ! Merci de contacter <@287559092724301824> !`);
    }
    let logChannel = message.guild.channels.cache.get(guild.settings.logChannel);
    if (logChannel) {
        let embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`:wastebasket: Suppression de plusieurs messages`)
            .setDescription(`${message.member} a supprimé ${number-1} messages dans ${message.channel}`)
            .setTimestamp(Date.now());
        return logChannel.send(embed);
    }

    return;

};

module.exports.help = {
    name: "clear",
    aliases : ["cl", "c"],
    category : 'moderation',
    description: "Supprime un nombre défini de messages",
    cooldown: 0,
    usage: "<integer>",
    args: true,
    permission: "staff",
};