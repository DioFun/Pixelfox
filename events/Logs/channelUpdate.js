const { MessageEmbed } = require("discord.js");
const translatedPerms = {
    "ADD_REACTIONS": `Ajouter des réactions`, "ADMINISTRATOR": `Administateur`, "ATTACH_FILES": `Joindre des fichiers`, "BAN_MEMBERS": `Bannir des membres`, "CHANGE_NICKNAME": `Changer de pseudo`, "CONNECT": `Rejoindre des salons vocaux`, "CREATE_INSTANT_INVITE": `Créer une invitation`, "DEAFEN_MEMBERS": `Rendre les membres sourds`, "EMBED_LINKS": `Intégrer des liens`, "KICK_MEMBERS": `Expulser des membres`, "MANAGE_CHANNELS": `Gérer les salons`, "MANAGE_EMOJIS": `Gérer les émojis et les autocollants`, "MANAGE_GUILD": `Gérer le serveur`, "MANAGE_MESSAGES": `Gérer les messages`, "MANAGE_NICKNAMES": `Gérer les pseudos`, "MANAGE_ROLES": `Gérer les permissions`, "MANAGE_WEBHOOKS": `Gérer les Webhooks`, "MENTION_EVERYONE": `Mentionner @everyone, @here et tous les rôles`, "MOVE_MEMBERS": `Déplacer des membres`, "MUTE_MEMBERS": `Rendre muet les membres`, "PRIORITY_SPEAKER": `Voix prioritaire`, "READ_MESSAGE_HISTORY": `Voir l'historique des messages`, "SEND_MESSAGES": `Envoyer des messages`, "SEND_TTS_MESSAGES": `Envoyer des messages TTS (Text To Speach)`, "SPEAK": `Parler dans les salons vocaux`, "STREAM": `Partager son écran ou sa caméra`, "USE_EXTERNAL_EMOJIS": `Utiliser des émojis ne provenant pas du serveur`, "USE_VAD": `Utiliser la détection de voix`, "VIEW_AUDIT_LOG": `Voir les logs du serveur`, "VIEW_CHANNEL": `Voir les salons`, "VIEW_GUILD_INSIGHTS": `Voir les analyses du serveur`};
module.exports = async (client, oldChannel, newChannel) => {
    if (!newChannel.guild || oldChannel === newChannel) return;
    let data = await client.getGuild(newChannel.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = newChannel.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;

    let edited = {};
    for (const key in oldChannel) {
        if (oldChannel[key] !== newChannel[key]) edited[key] = newChannel[key];
    };
    if (edited.rawPosition && !edited.parentID) return;

    let fetchGuildAuditLogs = await oldChannel.guild.fetchAuditLogs({
        limit: 1
    });
    const latestChannelUpdated = fetchGuildAuditLogs.entries.first();
    if (latestChannelUpdated.target !== newChannel) return;
    let description = `${latestChannelUpdated.executor} a modifié le salon ${newChannel} !`;
    let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`✏️ Modification de salon`)
        .addField("Type du salon", newChannel.type)
        .setFooter(`ID du salon: ${newChannel.id}`)
        .setTimestamp(latestChannelUpdated.createdTimestamp);

    if (edited.parentID) {
        embed.addField(`Catégorie`, `${oldChannel.parent.name} -> ${newChannel.parent.name}`);
        embed.setDescription(description);
        return logChannel.send(embed);
    };
    switch (latestChannelUpdated.action) {
        case "CHANNEL_UPDATE":
            if (latestChannelUpdated.changes.find(e => e.key === "name")) embed.addField(`Nom`, `${oldChannel.name} -> ${newChannel.name}`);
            if (newChannel.type === "text" || newChannel.type === "news") {
                if (latestChannelUpdated.changes.find(e => e.key === "nsfw")) embed.addField(`NSFW`, newChannel.nsfw ? `Actif` : `Inactif`);
                if (latestChannelUpdated.changes.find(e => e.key === "topic")) embed.addFields([
                    {name: `Ancien sujet`, value: oldChannel.topic ? oldChannel.topic : `Aucun sujet`, inline: true},
                    {name: `Nouveau sujet`, value: newChannel.topic ? newChannel.topic : `Aucun sujet`, inline: true}
                ]);
                if (latestChannelUpdated.changes.find(e => e.key === "rate_limit_per_user")) embed.addFields([
                    {name: `Ancien cooldown`, value: oldChannel.rateLimitPerUser ? `${oldChannel.rateLimitPerUser} secondes` : `Aucun cooldown`, inline: true},
                    {name: `Nouveau cooldown`, value: newChannel.rateLimitPerUser ? `${newChannel.rateLimitPerUser} secondes` : `Aucun cooldown`, inline: true}
                ]);
            }else if (newChannel.type === "voice") {
                if (latestChannelUpdated.changes.find(e => e.key === "user_limit")) embed.addFields([
                    {name: `Ancienne limite`, value: oldChannel.userLimit ? oldChannel.userLimit : `Aucune limite`, inline: true},
                    {name: `Nouvelle limite`, value: newChannel.userLimit ? newChannel.userLimit : `Aucune limite`, inline: true}
                ]);
            };
            break;

        case "CHANNEL_OVERWRITE_CREATE":
            description = description = `${latestChannelUpdated.executor} a ajouté des permissions ${latestChannelUpdated.extra.roles ? `à` : `au rôle`} ${latestChannelUpdated.extra} dans le salon ${newChannel}`;
            break;

        case "CHANNEL_OVERWRITE_UPDATE":
            description = `${latestChannelUpdated.executor} a modifié les permissions ${latestChannelUpdated.extra.roles ? `de` : `du rôle`} ${latestChannelUpdated.extra} dans le salon ${newChannel}`;
            const oldPermissions = {allow: oldChannel.permissionOverwrites.get(latestChannelUpdated.extra.id).allow.serialize(), deny: oldChannel.permissionOverwrites.get(latestChannelUpdated.extra.id).deny.serialize()};
            const newPermissions = {allow: newChannel.permissionOverwrites.get(latestChannelUpdated.extra.id).allow.serialize(), deny: newChannel.permissionOverwrites.get(latestChannelUpdated.extra.id).deny.serialize()};
            let edited = {allowed: {added: [], removed: []}, denied: {added: [], removed: []}, inherit: []};
            for (const Perm in oldPermissions.allow) {
                if (Object.hasOwnProperty.call(oldPermissions.allow, Perm)) {
                    const oldPerm = oldPermissions.allow[Perm];
                    const newPerm = newPermissions.allow[Perm];
                    if (!oldPerm && newPerm) edited.allowed.added.push(Perm);
                    else if (oldPerm && !newPerm) edited.allowed.removed.push(Perm);
                }
                if (Object.hasOwnProperty.call(oldPermissions.deny, Perm)) {
                    const oldPerm = oldPermissions.deny[Perm];
                    const newPerm = newPermissions.deny[Perm];
                    if (!oldPerm && newPerm) edited.denied.added.push(Perm);
                    else if (oldPerm && !newPerm) edited.denied.removed.push(Perm);
                }
            }
            for (let i = 0; i < edited.allowed.removed.length; i++) {
                const e = edited.allowed.removed[i];
                if (!edited.denied.added.find(element => element === e)) edited.inherit.push(e);
            }
            for (let i = 0; i < edited.denied.removed.length; i++) {
                const e = edited.denied.removed[i];
                if (!edited.allowed.added.find(element => element === e)) edited.inherit.push(e);
            }
            if (edited.allowed.added.length) embed.addField(edited.allowed.added.length > 1 ? `Permissions ajoutées` : `Permission ajoutée`, edited.allowed.added.map(e => translatedPerms[e]).join(`\n`));
            if (edited.inherit.length) embed.addField(edited.inherit.length > 1 ? `Permissions héritées` : `Permission héritée`, edited.inherit.map(e => translatedPerms[e]).join(`\n`));
            if (edited.denied.added.length) embed.addField(edited.denied.added.length > 1 ? `Permissions supprimées` : `Permission supprimée`, edited.denied.added.map(e => translatedPerms[e]).join(`\n`));
            break;
        
        case "CHANNEL_OVERWRITE_DELETE":
            description = `${latestChannelUpdated.executor} a supprimé les permissions ${latestChannelUpdated.extra.roles ? `de` : `du rôle`} ${latestChannelUpdated.extra} dans le salon ${newChannel}`;
            break;
    
        default:
            return logChannel.send(`<:prohibited:866955746754953237> Une opération a eu lieu sur le salon ${newChannel} mais n'a pas pu être enregistrée !`);
    }
    embed.setDescription(description);
    return logChannel.send(embed);
};