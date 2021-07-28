const { BackMessage } = require("../../class/BackMessage");

module.exports.run = async (client, message, args, guild) => {
    if (!args[0]) {

        let data = await client.getMember(message.member, message.guild);
        return new BackMessage(data.birthdate ? "custom" : "error", data.birthdate ? `:tada: Votre date d'anniversaire est fixée au **${data.birthdate}**.\nPour supprimer votre date d'anniversaire, utilisez la commande \`${guild.settings.prefix}${this.help.name} remove\`` : `Vous n'avez pas défini votre anniversaire.\nUtilisez \`${guild.settings.prefix}${this.help.name} set [JJ/MM/AAAA]\` pour définir votre date d'anniversaire.`);

    } else if ((message.mentions.members.first() || message.guild.members.cache.find(e => (e.id === args[0] || e.user.username.toLowerCase() === args[0].toLowerCase() || e.displayName.toLowerCase().includes(args[0].toLowerCase())) && !e.user.bot)) && args[0].toLowerCase() !== "set" && args[0].toLowerCase() !== "remove") {

        let member = message.mentions.members.first() || message.guild.members.cache.find(e => e.id === args[0] || e.user.username.toLowerCase() === args[0].toLowerCase() || e.displayName.toLowerCase().includes(args[0].toLowerCase()));
        let data = await client.getMember(member, message.guild);
        return new BackMessage(data.birthdate ? "custom" : "error", data.birthdate ? `:tada: La date d'anniversaire de ${member.displayName} est le **${data.birthdate}**.` : `${member.displayName} n'a pas défini sa date d'anniversaire.`);

    } else if (args[0].toLowerCase() === "set" && args[1]) {
        let birthday = args[1].split("/");
        if (birthday.length === 2 || birthday.length === 3){
            let day = Number.parseInt(birthday[0]);
            let month = Number.parseInt(birthday[1]);
            birthday = Date.parse(`${month}/${day}`);
            if (!birthday) return new BackMessage("error", "Le format de la date est invalide ! Le format doit être JJ/MM ou JJ/MM/AAAA");
            let data = await client.getMember(message.member, message.guild);
            data.birthdate = args[1];
            await client.updateMember(message.member, message.guild, data);
            return new BackMessage("success", `Votre date d'anniversaire a bien été sauvegardée (\`${data.birthdate}\`) !`);
        }
    } else if (args[0].toLowerCase() === "remove") {
        let data = await client.getMember(message.member, message.guild);
        if (!data.birthdate) return new BackMessage("error", `Vous n'avez pas défini votre anniversaire.\nUtilisez \`${guild.settings.prefix}${this.help.name} set [JJ/MM(/AAAA)]\` pour définir votre date d'anniversaire.`);
        data.birthdate = "";
        await client.updateMember(message.member, message.guild, data);
        return new BackMessage("success", `Votre date d'anniversaire a bien été supprimée !`);
    }
    return new BackMessage("error", "Mauvaise utilisation de la commande !");
};

module.exports.help = {
    name: "birthday",
    aliases : ["bd", "birthdate"],
    category : 'fun',
    description: "Permet de définir sa date de naissance/anniversaire pour que le bot vous souhaite ce dernier.",
    cooldown: 300,
    usage: '([@user,remove,set]) set:<JJ/MM(/AAAA)>',
    args: false,
    permission: false,
};