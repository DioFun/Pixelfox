const { TStoDate } = require('../../tools/date.js');

module.exports.run = async (client, message, args) => {
    return message.channel.send(TStoDate(Date.now()))
};

module.exports.help = {
    name: "time",
    aliases : ["time"],
    category : 'developpement',
    description: "renvoie l'heure",
    cooldown: 0,
    usage: "",
    args: false,
    permission: "développeur",
}