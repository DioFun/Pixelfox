const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args, guild) => {
    if (args.length < 2) return message.channel.send(`:x: Vous n'avez pas renségné assez d'arguments ! Utilisation de la commande : \`${guild.settings.prefix}${this.help.name} ${this.help.usage}\``);
    
    switch (args.shift().toLowerCase()) {
        case 'birthday':
            switch (args.shift().toLowerCase()) {
                case 'view':
                    if (!guild.settings.birthdayMessage) return message.channel.send(":x: Il n'y a pas de message d'anniversaire défini !");
                    return message.channel.send(`Le message d'anniversaire actuel est: \`\`\` ${guild.settings.birthdayMessage} \`\`\` \nPlaceholders:\n> {members}: membres ayant leur anniversaire, séparés par une virgule\n> {fullDate}: Date du jour (Ex: 4 Avril 2021)`);

                case 'set':
                    let newMessage = args.join(" ");
                    if (!newMessage) return message.channel.send(`:x: Vous n'avez pas renségné de message ! Utilisation de la commande : \`${guild.settings.prefix}${this.help.name} ${this.help.usage}\``);
                    guild.settings.birthdayMessage = newMessage;
                    client.updateGuild(message.guild, guild);
                    return message.channel.send(`:white_check_mark: Le message d'anniversaire actuel est désormais: \`\`\` ${newMessage} \`\`\``);
            }
    
        case 'welcome':
            switch (args.shift().toLowerCase()) {
                case 'display':
                    message.channel.send('Voici les différents messages d\'accueil existants :');

                    let embed = new MessageEmbed()
                        .setTitle('Messages de bienvenue')
                        .setDescription('{user} : mention de l\'utilisateur')
                        .setColor('ORANGE');

                    for (let i = 0; i < guild.settings.welcomeMessages.length; i++) {
                        const mess = guild.settings.welcomeMessages[i];
                        let nbr = i + 1
                        embed.addField('Message #' + nbr, mess);
                    }

                    return message.channel.send(embed);

                case 'add':
                    let newmessage = args.join(' ');
                    guild.settings.welcomeMessages.push(newmessage);
                    client.updateGuild(message.guild, guild);
                    return message.channel.send(`:white_check_mark: Un nouveau message de bienvenue vient d\'être ajouté : \`\`\`${newmessage}\`\`\``);

                case 'remove':
                    let index = args[0] - 1;
                    if(!guild.settings.welcomeMessages[index] || Number.isNaN(index)) return message.channel.send(":x: Le numéro spécifié est incorrect ou ne correspond à aucun message !");

                    guild.settings.welcomeMessages.splice(index, 1);
                    client.updateGuild(message.guild, guild);            

                    return message.channel.send(`:white_check_mark: Le message de bienvenue #${args} a bien été supprimé !`);
            }

        default:
            return message.channel.send(`Les arguments spécifiés sont invalides ou inexistants. Utilisation de la commande : \`${guild.settings.prefix}${this.help.name} ${this.help.usage}\``);
    }
};

module.exports.help = {
    name: "messages",
    aliases : ["messages"],
    category : 'paramètres',
    description: "Permet de changer les messages de bienvenues et le message d'anniversaire",
    cooldown: 0,
    usage: "<birthday,welcome> <display,birthday:[set],welcome:[add,remove]> <valeur>",
    args: true,
    permission: "staff",
};