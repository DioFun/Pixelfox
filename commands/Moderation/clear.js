module.exports.run = async (client, message, args) => {
    let number = Number.parseInt(args[0])+1;
    if (number > 100) return message.channel.send(":x: Impossible de supprimer autant de messages !")

    try {
        message.channel.bulkDelete(number)
            .then(messages => {
                message.channel.send(`:white_check_mark: \`${messages.size-1}\` messages ont été supprimés !`)
                    .then(e => setTimeout(() => e.delete(), 5000));
            });
    } catch (e) {
        console.log(e);
        return message.channel.send(":x: Une erreur s'est produite !")
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