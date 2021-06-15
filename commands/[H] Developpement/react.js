module.exports.run = async (client, message, args) => {
    message.reply("test");

};

module.exports.help = {
    name: "react",
    aliases : ["react"],
    category : 'developpement',
    description: "",
    cooldown: 0,
    usage: "",
    args: false,
    permission: "développeur",
}