const { MessageEmbed } = require("discord.js");

exports.BackMessage = class {
    constructor (type, message, callback = undefined) {
        this.type = type.toLowerCase();
        this.message = message;
        this.callback = callback;
    };
    exist () {
        if ((this.type !== "error" && this.type !== "warning" && this.type !== "success" && this.type !== "custom") || !this.message) return false;
        else return true;
    };
    send (channel, guild, command) {
        var embed = new MessageEmbed();
        var description = `${this.message}\n\n`
        if (this.type === "custom") {
            return channel.send(this.message);
        }
        switch (this.type) {
            case "warning":
                embed.setColor("YELLOW");
                embed.setTitle(`⚠️ Un problème a été detecté ! ⚠️`);
                description += `Une erreur anormale est survenue ! Merci de contacter le développeur !`;
                break;

            case "error":
                embed.setColor("RED");
                embed.setTitle(`:x: Commande invalide :x:`);
                description += `Utilisation de la commande : \`${guild.settings.prefix}${command.help.name} ${command.help.usage}\``;
                break;
        
            case "success": 
                embed.setColor("GREEN");
                embed.setTitle("<:greentick:863347899877687336> Commande effectuée <:greentick:863347899877687336>");
                break;
        }
        embed.setDescription(description);
        embed.setFooter(`Pour plus d'informations sur la commande "${guild.settings.prefix}help ${command.help.name}"`);
        return channel.send(embed);
    };
    hasCallback() {
        if (this.callback) return true;
        return false;
    }
};