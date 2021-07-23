const { MessageEmbed, Permissions } = require("discord.js");
const translatedPerms = {
    "ADD_REACTIONS": `Ajouter des réactions`, "ADMINISTRATOR": `Administateur`, "ATTACH_FILES": `Joindre des fichiers`, "BAN_MEMBERS": `Bannir des membres`, "CHANGE_NICKNAME": `Changer de pseudo`, "CONNECT": `Rejoindre des salons vocaux`, "CREATE_INSTANT_INVITE": `Créer une invitation`, "DEAFEN_MEMBERS": `Rendre les membres sourds`, "EMBED_LINKS": `Intégrer des liens`, "KICK_MEMBERS": `Expulser des membres`, "MANAGE_CHANNELS": `Gérer les salons`, "MANAGE_EMOJIS": `Gérer les émojis et les autocollants`, "MANAGE_GUILD": `Gérer le serveur`, "MANAGE_MESSAGES": `Gérer les messages`, "MANAGE_NICKNAMES": `Gérer les pseudos`, "MANAGE_ROLES": `Gérer les rôles`, "MANAGE_WEBHOOKS": `Gérer les Webhooks`, "MENTION_EVERYONE": `Mentionner @everyone, @here et tous les rôles`, "MOVE_MEMBERS": `Déplacer des membres`, "MUTE_MEMBERS": `Rendre muet les membres`, "PRIORITY_SPEAKER": `Voix prioritaire`, "READ_MESSAGE_HISTORY": `Voir l'historique des messages`, "SEND_MESSAGES": `Envoyer des messages`, "SEND_TTS_MESSAGES": `Envoyer des messages TTS (Text To Speach)`, "SPEAK": `Parler dans les salons vocaux`, "STREAM": `Partager son écran ou sa caméra`, "USE_EXTERNAL_EMOJIS": `Utiliser des émojis ne provenant pas du serveur`, "USE_VAD": `Utiliser la détection de voix`, "VIEW_AUDIT_LOG": `Voir les logs du serveur`, "VIEW_CHANNEL": `Voir les salons`, "VIEW_GUILD_INSIGHTS": `Voir les analyses du serveur`};
module.exports = async (client, oldRole, newRole) => {
    if (!newRole.guild) return;
    let data = await client.getGuild(newRole.guild);
    if (!data || !data?.settings?.logChannel) return;
    let logChannel = newRole.guild.channels.cache.find(e => e.id === data.settings.logChannel);
    if (!logChannel) return;
    let fetchGuildAuditLogs = await newRole.guild.fetchAuditLogs({
        limite: 1,
        type: "ROLE_UPDATE"
    });
    const latestRoleUpdated = fetchGuildAuditLogs.entries.first();
    const changes = latestRoleUpdated.changes;

    
    let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`:pencil2: Modification d'un rôle`)
        .setDescription(`${latestRoleUpdated.executor} a modifié le rôle ${newRole} !`)
        .setFooter(`ID du rôle: ${newRole.id}`)
        .setTimestamp(latestRoleUpdated.createdTimestamp);

    if (oldRole.name !== newRole.name) embed.addField(`Nom`, `${oldRole.name} -> ${newRole.name}`, true);
    if (oldRole.hoist !== newRole.hoist) embed.addField(`Affichage séparé`, oldRole.hoist ? `Oui -> Non` : `Non -> Oui`, true);
    if (oldRole.hexColor !== newRole.hexColor) embed.addField(`Couleur`, `${oldRole.hexColor} -> ${newRole.hexColor}`);
    if (oldRole.mentionable !== newRole.mentionable) embed.addField(`Peut être mentionné`, oldRole.mentionable ? `Oui -> Non` : `Non -> Oui`);

    if(changes.find(e => e.key === `permissions`)) {
        const oldPermissions = oldRole.permissions.serialize();
        const newPermissions = newRole.permissions.serialize();
        if (!oldPermissions.ADMINISTRATOR && !newPermissions.ADMINISTRATOR) {
            var permissionsModified = {allowed: [], denied: []};
            for (const Perm in oldPermissions) {
                if (Object.hasOwnProperty.call(oldPermissions, Perm)){
                    if (oldPermissions[Perm] === newPermissions[Perm]) continue;
                    else if (oldPermissions[Perm] && !newPermissions[Perm]) {
                        permissionsModified.denied.push(Perm);
                    }else if (!oldPermissions[Perm] && newPermissions[Perm]) {
                        permissionsModified.allowed.push(Perm);
                    } else logChannel.send(`:x: Une erreur s'est produite lors de l'enregistrement d'une modification de rôle !`);
                };
            };
            if (permissionsModified.allowed.length) embed.addField(permissionsModified.allowed.length > 1 ? `Permissions ajoutées` : `Permission ajoutée`, permissionsModified.allowed.map(e => translatedPerms[e]).join("\n"));
            if (permissionsModified.denied.length) embed.addField(permissionsModified.denied.length > 1 ? `Permissions supprimées` : `Permission supprimée`, permissionsModified.denied.map(e => translatedPerms[e]).join("\n"));
        } else if (oldPermissions.ADMINISTRATOR && !newPermissions.ADMINISTRATOR) embed.addField(`Permission supprimée`, `Administrateur`);
        else if (!oldPermissions.ADMINISTRATOR && newPermissions.ADMINISTRATOR) embed.addField(`Permission ajoutée`, `Administrateur`);
    };

    return logChannel.send(embed);
};