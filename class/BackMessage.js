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
                embed.setTitle(`<:warn:866955793186553866> Un problème a été detecté ! <:warn:866955793186553866>`);
                description += `Une erreur anormale est survenue ? Merci de contacter le développeur !`;
                break;

            case "error":
                embed.setColor("RED");
                embed.setTitle(`<:prohibited:866955746754953237> Commande invalide <:prohibited:866955746754953237>`);
                description += `Utilisation de la commande : \`${guild.settings.prefix}${command.help.name} ${command.help.usage}\``;
                break;
        
            case "success": 
                embed.setColor("GREEN");
                embed.setTitle("<:info:866955853160251411> Commande effectuée <:info:866955853160251411>");
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