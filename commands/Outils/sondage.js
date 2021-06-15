const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args) => {
    message.delete();
    args = args.join(" ").split('"');
    if (args.length > 55) return message.channel.send(`:x: Il n'y a trop de réponses possible pour créer un sondage !\nUtilisation de la commande \`${client.settings.prefix}${this.help.name} ${this.help.usage}\``);
    if (args.length < 7 && args.length > 3) return message.channel.send(`:x: Il n'y a pas assez d'arguments pour créer un sondage !\nUtilisation de la commande \`${client.settings.prefix}${this.help.name} ${this.help.usage}\``);

    if (args.length === 3) {
      args = args.concat([ "Oui", "", "Non", ""]);
    }

    let title = args.slice(1).shift();
    args = args.slice(2);

    let embed = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle(`:bar_chart: ${title}`)
        .setFooter(`${message.author.username}`, message.author.avatarURL());

    let reactions = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮","🇯","🇰","🇱","🇲","🇳","🇴","🇵","🇶","🇷","🇸","🇹","🇺","🇻","🇼","🇽","🇾","🇿"]
    let description = "Possibilités de réponse :\n";
    let answerNbr = Math.floor((args.length)/2);
    let i = 0;

    while (i < answerNbr) {
        const element = args.slice(1).shift();
        description += `${reactions[i]} ${element}\n`;
        args = args.slice(2);
        i++;
    };

    embed.setDescription(description);
    message.channel.send(embed)
      .then(message => {
      let i = 0
          while (i < answerNbr) {
              message.react(reactions[i]);
              i++;
          };
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
