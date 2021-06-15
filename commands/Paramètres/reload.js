const { saveFile } = require('../../tools/file.js');

module.exports.run = async (client, message, args) => {
    await message.channel.send(":white_check_mark: Redémmarage du bot en cours...");
    process.exit();
};

module.exports.help = {
    name: "reload",
    aliases : ["rel", "restart"],
    category : 'paramètres',
    description: "Redémarre le bot",
    cooldown: 0,
    usage: "",
    args: false,
    permission: "admin",
};