const { Collection } = require("discord.js");
const { getRndInteger } = require("../../tools/random")

module.exports = async (client, message, guild) => {
    // -> Incrément d'Xp (/!\ Multiplicateur de channel)
    // -> Vérification passer level au dessus (Fonction)
    // -> Si passage de Level ==> envoyer un message + vérifier si grade au dessus (Fonction)

    // -> Incrément d'Xp avec paramètres du serveur + Multiplicateur du salon (paramètres du serveur)
    // -> Fonction gloabale de gestion de l'Xp
    // -> Vérification avec grades paramètre des serveurs voir au dessus aussi si passage de plusieurs level fonctionn utilisable n'importe ou
    // ->   Prendre tous les grades au dessus du level puis les ranger et prendre le premier
    // ->   Supprimer les grades en dessous 
    // ->   Quand changement paramètres de grade changer les rôles aussi avec passage en revue complet des membres

    // -> Vérification pour attribution d'xp
    if (client.experience.has(message.guild.id)){
        if (!client.experience.get(message.guild.id).has(message.member.id)) client.experience.get(message.guild.id).set(message.member.id, 0);
        if (client.experience.get(message.guild.id).get(message.member.id) >= guild.settings.experience?.maxUses) return;
    } else {
        client.experience.set(message.guild.id, new Collection().set(message.member.id, 0));
    };

    // -> Attribution d'xp
    let multiplier = guild.settings.experience?.channelMultiplier?.find(e => e.id === message.channel.id) || 1
    let gain = Math.ceil(getRndInteger(guild.settings.experience?.xpMin || 15, guild.settings.experience?.xpMax || 25) * multiplier);
    let member = message.member;
    let data = await client.getMember(member, message.guild);
    data.experience += gain;
    data.messages += 1;
    await client.updateMember(member, message.guild, data);
    client.experience.get(message.guild.id).set(message.member.id, client.experience.get(message.guild.id).get(message.member.id) + 1);
    setTimeout(() => {
        client.experience.get(message.guild.id).set(message.member.id, client.experience.get(message.guild.id).get(message.member.id) - 1);
        console.log(client.experience.get(message.guild.id).get(message.member.id));
    }, 60000);

    // TODO Vérifier passage de level ainsi que grades via fonctions globales
}