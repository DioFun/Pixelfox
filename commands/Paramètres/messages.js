const { MessageEmbed } = require("discord.js");
const { BackMessage } = require("../../class/BackMessage");

module.exports.run = async (client, message, args, guild) => {
    if (args.length < 2) return new BackMessage("error", `Arguments Manquants !`);
    
    switch (args.shift().toLowerCase()) {
        case 'birthday':
            switch (args.shift().toLowerCase()) {
                case 'view':
                    if (!guild.settings.birthdayMessage) return new BackMessage("error", `Il n'y a pas de message d'anniversaire défini !`);
                    return new BackMessage("custom", `Le message d'anniversaire actuel est: \`\`\` ${guild.settings.birthdayMessage} \`\`\` \nPlaceholders:\n> {members}: membres ayant leur anniversaire, séparés par une virgule\n> {fullDate}: Date du jour (Ex: 4 Avril 2021)`);

                case 'set':
                    let newMessage = args.join(" ");
                    if (!newMessage) return new BackMessage("error", `Vous n'avez pas renségné de message !`);
                    guild.settings.birthdayMessage = newMessage;
                    client.updateGuild(message.guild, guild);
                    return new BackMessage("success", `Le message d'anniversaire actuel est désormais: \`\`\` ${newMessage} \`\`\``);
            }

        case 'experience':
            switch (args.shift().toLowerCase()) {
                case 'view':
                    if (!guild.settings.experience.levelUpMessage) return new BackMessage("error", `Il n'y a pas de message d'expérience défini !`);
                    return new BackMessage("custom", `Le message d'expérience actuel est: \`\`\` ${guild.settings.experience.levelUpMessage} \`\`\` \nPlaceholders:\n> {user}: utilisateur qui augmente de niveau\n> {level}: nouveau niveau du membre`);

                case 'set':
                    let newMessage = args.join(" ");
                    if (!newMessage) return new BackMessage("error", `Vous n'avez pas renségné de message !`);
                    guild.settings.experience.levelUpMessage = newMessage;
                    client.updateGuild(message.guild, guild);
                    return new BackMessage("success", `Le message d'expérience actuel est désormais: \`\`\` ${newMessage} \`\`\``);
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

                    return new BackMessage("custom", embed);

                case 'add':
                    let newmessage = args.join(' ');
                    guild.settings.welcomeMessages.push(newmessage);
                    client.updateGuild(message.guild, guild);
                    return new BackMessage("success", `Un nouveau message de bienvenue vient d\'être ajouté : \`\`\`${newmessage}\`\`\``);

                case 'remove':
                    let index = args[0] - 1;
                    if(!guild.settings.welcomeMessages[index] || Number.isNaN(index)) return new BackMessage("error", `Le numéro spécifié est incorrect ou ne correspond à aucun message !`);

                    guild.settings.welcomeMessages.splice(index, 1);
                    client.updateGuild(message.guild, guild);            

                    return new BackMessage("success", `Le message de bienvenue #${args} a bien été supprimé !`);
            }

        default:
            return new BackMessage("error", `Les arguments spécifiés sont invalides ou inexistants !`);
    }
};

module.exports.help = {
    name: "messages",
    aliases : ["messages"],
    category : 'paramètres',
    description: "Permet de changer les messages de bienvenues et le message d'anniversaire",
    cooldown: 0,
    usage: "<birthday,experience,welcome> <display,birthday/experience:[set],welcome:[add,remove]> <valeur>",
    args: true,
    permission: "staff",
};