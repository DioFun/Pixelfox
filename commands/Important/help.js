const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('graceful-fs');
const { BackMessage } = require('../../class/BackMessage');

const categoryList = readdirSync('./commands')

module.exports.run = async (client, message, args, guild) => {
    if (!args.length) {
        const embed = new MessageEmbed()
            .setColor('#f57c03')
            .setTitle("Liste des commandes")
            .setDescription(`Une liste de toutes les sous-catégories disponibles et leurs commandes. \nPour plus d'informations sur une commande : \`${guild.settings.prefix}${this.help.name} ${this.help.usage}\``)
        for (const category of categoryList) {
            if (!category.startsWith("[H]")){
                embed.addField(
                    `${category}`,
                    `${client.commands.filter(cat => cat.help.category === category.toLowerCase()).map(cmd => cmd.help.name).join(", ")}`
                );
            }
        };

        return new BackMessage("custom", embed);
    } else {
        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0]));
        if(!command) return new BackMessage("error", "Impossible d'afficher de l'aide pour une commande non existante !");

        const embed = new MessageEmbed()
            .setColor('#f57c03')
            .setTitle(`${command.help.name.charAt(0).toUpperCase()}${command.help.name.substring(1).toLowerCase()}`)
            .addField("Description", `${command.help.description}.`)
            .addField("Utilisation", command.help.usage ? `${guild.settings.prefix}${command.help.name} ${command.help.usage}` : `${guild.settings.prefix}${command.help.name}`)
            .setFooter("Légende :\n(argument) : L'argument est optionnel \n<argument> : l'argument est obligatoire \n[argument1, argument2, argument3] L'argument est à choisir parmi la liste disponible");

        if (command.help.cooldown || guild.settings.cooldown) embed.addField("Cooldown", `${command.help.cooldown ? command.help.cooldown : guild.settings.cooldown} secondes`, true)
        if (command.help.aliases.length > 1) embed.addField("Aliases", `${command.help.aliases.join(', ')}`, true);

        return new BackMessage("custom", embed);
    }
};

module.exports.help = {
    name: "help",
    aliases : ["h", "aide"],
    category : 'important',
    description: "Affiche une liste des commandes ou une aide concernant une commande",
    cooldown: 0,
    usage: "(command_name)",
    args: false,
    permission: false,
};

/**
 *   .setFooter("(argument) : L'argument est optionnel \n<argument> : l'argument est obligatoire \n[argument1, argument2, argument3] L'argument est à choisir parmi la liste disponible")
*/
