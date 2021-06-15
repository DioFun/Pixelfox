const { saveFile } = require('../../tools/file');

module.exports.run = (client, message, args) => {
    let newactivity = args.join(' ');
    client.settings.status = newactivity;
    saveFile('settings.json', client.settings);

    client.user.setActivity(newactivity);

    return message.channel.send(`:white_check_mark: Le statut du bot a bien été changé pour \`${newactivity}\``);
};

module.exports.help = {
    name: "setstatus",
    aliases : ["setactivity", "ss", "setact"],
    category : 'paramètres',
    description: "Change le statut du bot",
    cooldown: 0,
    usage: "<new_status>",
    args: true,
    permission: "admin",
};