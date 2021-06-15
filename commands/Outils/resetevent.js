module.exports.run = (client, message, args) => {
    message.delete();
    client.event = [];
    message.channel.send(":white_check_mark: Les permissions ont bien été réinitialisées !");
};

module.exports.help = {
    name: "resetevent",
    aliases : ["re", "revent"],
    category : 'outils',
    description: "Permet de reset les permissions de parler sur l'event en cours !",
    cooldown: 300,
    usage: '',
    args: false,
    permission: "staff",
};
