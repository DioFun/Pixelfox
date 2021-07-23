const { MessageEmbed } = require("discord.js");
module.exports = async (client, oldUser, newUser) => {
    let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`:pencil2: Modification d'un utilisateur`)
        .setDescription(`${newUser} a modifié son profil !`)
        .setFooter(`ID de l'utilisateur: ${newUser.id}`)
        .setThumbnail(newUser.avatarURL())
        .setTimestamp(Date.now());

    if (oldUser.avatar !== newUser.avatar) embed.addField(`Photo de profil`, `${oldUser.avatar ? `Avatar existant` : `Aucun avatar`} -> ${newUser.avatar ? `[Après](${newUser.avatarURL()})` : `Aucun avatar`}`);
    if (oldUser.tag !== newUser.tag) embed.addField(`Nom d'utilisateur`, `${oldUser.tag} -> ${newUser.tag}`);
    
    client.guilds.cache.forEach(async guild => {
        if (!guild.members.cache.find(e => e.id === newUser.id)) return;
        if (!guild) return;
        let data = await client.getGuild(guild);
        if (!data || !data?.settings?.logChannel) return;
        let logChannel = guild.channels.cache.find(e => e.id === data.settings.logChannel);
        if (!logChannel) return;
        logChannel.send(embed);
    });
};