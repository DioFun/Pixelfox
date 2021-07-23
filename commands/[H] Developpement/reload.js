const { BackMessage } = require('../../class/BackMessage.js');
const { saveFile } = require('../../tools/file.js');

module.exports.run = async (client, message, args, guild) => {
    if (message.author.id !== `287559092724301824`) return;
    await new BackMessage("success", `Redémarage du bot en cours...`).send(message.channel, guild, this);
    process.exit();
};

module.exports.help = {
    name: "reload",
    aliases : ["rel", "restart"],
    category : 'developpement',
    description: "Redémarre le bot",
    cooldown: 0,
    usage: "",
    args: false,
    permission: "développeur",
};