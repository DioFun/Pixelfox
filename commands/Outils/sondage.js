const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args) => {
    message.delete();
    args = args.join(" ").replace(/(?<=")\s(?=")/g, "").replace(/(?<=")"/g, "").match(/(?<=").+?(?=")/g); 
    let title = args.shift();
    if (!title) return message.channel.send(`:x: Vous n'avez pas spécifié de titre pour votre sondage !`);
    if (args.length > 26) return message.channel.send(`:x: Il y a trop de réponses possible pour créer un sondage !`);
    else if (args.length === 1) return message.channel.send(`:x: Vous n'avez spécifié qu'une seule réponse !`);
    let embed = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle(`:bar_chart: ${title}`);

    if (args.length === 0) {
        return message.channel.send(embed)
            .then(m => {
                m.react(`✅`);
                m.react(`❌`);
            });
    }

    let reactions = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮","🇯","🇰","🇱","🇲","🇳","🇴","🇵","🇶","🇷","🇸","🇹","🇺","🇻","🇼","🇽","🇾","🇿"]
    let description = "";

    for (let i = 0; i < args.length; i++) {
        const e = args[i];
        description += `${reactions[i]} ${e}\n`;    
    }

    embed.setDescription(description).setFooter(`${message.author.username}`, message.author.avatarURL());
    message.channel.send(embed)
        .then(message => {
            for (let i = 0; i < args.length; i++) message.react(reactions[i]);
        });
};

module.exports.help = {
    name: "sondage",
    aliases : ["poll", "pl"],
    category : 'outils',
    description: "Permet de créer un sondage",
    cooldown: 300,
    usage: '"<poll_title>" "<answer1>" "<answer2>" ...',
    args: true,
    permission: false,
};
