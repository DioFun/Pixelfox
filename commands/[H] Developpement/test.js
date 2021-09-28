const { BackMessage } = require("../../class/BackMessage");

module.exports.run = async (client, message, args, guild) => {

};

module.exports.help = {
    name: "test",
    aliases : ["test"],
    category : 'developpement',
    description: "/",
    cooldown: 0,
    usage: "<usage> <cool>",
    args: false,
    permission: "développeur",
}