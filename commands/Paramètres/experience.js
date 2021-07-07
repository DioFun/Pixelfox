const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, guild) => {
    switch (args.shift().toLowerCase()) {
        case "reset":
            if (!message.mentions.members.first()) return message.channel.send(`:x: Vous n'avez pas mentionner de membre à réinitialiser ou l'argument spécifié est invalide !`);
            var data = await client.getMember(message.mentions.members.first(), message.member.guild);
            data.level = 0; data.experience = 0; data.messages = 0;
            await client.updateMember(message.mentions.members.first(), message.member.guild, data);
            await client.levelCheck(message.member);
            return message.channel.send(`:white_check_mark: L'expérience de ${message.mentions.members.first()} a bien été réinitialisée.`);

        case "multiplier":
            var channel = message.mentions.channels.first() || undefined;
            if (channel) {
                if (!args[1]) return message.channel.send(`:x: Vous n'avez pas spécifié le multiplicateur du salon ${channel}`);
                let multiplier = parseFloat(args[1]);
                if (isNaN(multiplier)) return message.channel.send(`:x: L'argument spécifié n'est pas un nombre décimal.`);
                let returnMessage;
                var existence = guild.settings?.experience?.channelMultiplier.findIndex(e => e.id === channel.id);
                if (existence !== -1) guild.settings?.experience?.channelMultiplier.splice(existence);
                if (multiplier === 1) returnMessage = `:white_check_mark: Le multiplicateur d'expérience dans ${channel} est désormais désactivé !`; 
                else { 
                    guild.settings?.experience?.channelMultiplier.push({id: channel.id, value: multiplier});
                    returnMessage = multiplier === 0 ? `:white_check_mark: L'expérience est désormais désactivée dans ${channel}` : `:white_check_mark: Le multiplicateur d'expérience de ${channel} est désormais de \`${multiplier}\``;
                };
                await client.updateGuild(message.guild, guild);
                return message.channel.send(returnMessage);
            } else {
                if (!guild.settings?.experience?.channelMultiplier.length) return message.channel.send(`Aucun multiplicateur de salon n'est actif`);
                var embed = new MessageEmbed()
                    .setColor("ORANGE")
                    .setTitle("Multiplicateurs d'expérience des salons")
                    .setDescription(guild.settings.experience.channelMultiplier.map(e => `<#${e.id}> <:red_arrow:861661373838131200> ${e.value}`));
                return message.channel.send(embed);
            };
        
        case "add":
            var member = message.mentions.members.first() || message.guild.members.cache.find(e => e.id === args[0] || e.user.username.toLowerCase() === args[0].toLowerCase() || e.displayName.toLowerCase().includes(args[0].toLowerCase())) || undefined;
            if (!member) return message.channel.send(`:x: Vous n'avez pas spécifié le membre dont vous souhaitez modifier l'expérience`);
            var amount = parseInt(args[1]) || undefined;
            if (!amount || isNaN(amount) || amount < 1) return message.channel.send(`:x: le montant d'expérience à ajouter n'est pas spécifié ou est invalide.`);
            var data = await client.getMember(member, member.guild);
            data.experience += amount;
            await client.updateMember(member, member.guild, data);
            client.levelCheck(member);
            return message.channel.send(`:white_check_mark: Vous avez ajouté \`${amount}\` points d'expérience à ${member}.`);

        case "remove":
            var member = message.mentions.members.first() || message.guild.members.cache.find(e => e.id === args[0] || e.user.username.toLowerCase() === args[0].toLowerCase() || e.displayName.toLowerCase().includes(args[0].toLowerCase())) || undefined;
            if (!member) return message.channel.send(`:x: Vous n'avez pas spécifié le membre dont vous souhaitez modifier l'expérience`);
            var amount = parseInt(args[1]) || undefined;
            if (!amount || isNaN(amount) || amount < 1) return message.channel.send(`:x: le montant d'expérience à ajouter n'est pas spécifié ou est invalide.`);
            var data = await client.getMember(member, member.guild);
            data.experience -= amount;
            await client.updateMember(member, member.guild, data);
            client.levelCheck(member);
            return message.channel.send(`:white_check_mark: Vous avez retiré \`${amount}\` points d'expérience à ${member}.`);

        case "ranks":
            if (args.length < 1) return message.channel.send(`:x: Arguments manquants`);
            switch (args.shift().toLowerCase()) {
                case "display":
                    if (!guild.settings.experience?.ranks?.length) return message.channel.send(`:x: Aucun grade d'expérience n'a été défini`);
                    var embed = new MessageEmbed()
                        .setColor("ORANGE")
                        .setTitle("Grades d'expérience par niveau")
                        .setDescription(guild.settings.experience.ranks.sort((a, b) => { return b.level - a.level; }).map(e => `<@&${e.id}> <:red_arrow:861661373838131200> ${e.level}`));
                    return message.channel.send(embed);

                case "add":
                    var role = message.mentions.roles.first() || message.guild.roles.cache.find(e => e.id === args[0] || e.name.toLowerCase().includes(args[0].toLowerCase())) || undefined;
                    if (!role) return message.channel.send(`:x: Le rôle mentionné est invalide`);
                    var roleLevel = parseInt(args[1]);
                    if (!roleLevel || isNaN(roleLevel)) return message.channel.send(`:x: L'argument spécifié n'est pas un nombre entier ou est invalide.`);
                    var existence = guild.settings?.experience?.ranks.findIndex(e => e.id === role.id || e.level === roleLevel);
                    if (existence !== -1) guild.settings?.experience?.ranks.splice(existence);
                    guild.settings.experience.ranks.push({id: role.id, level: roleLevel});
                    await client.updateGuild(message.guild, guild);
                    await client.ranksUpdate(message.guild);
                    return message.channel.send(`:white_check_mark: Le grade \`${role.name}\` a bien été ajouté au niveau ${roleLevel}`);

                case "remove":
                    var roleLevel = parseInt(args[0]);
                    if (!roleLevel || isNaN(roleLevel)) return message.channel.send(`:x: L'argument spécifié n'est pas un nombre entier ou est invalide.`);
                    var roleIndex = guild.settings?.experience?.ranks.findIndex(e => e.level === roleLevel);
                    if (roleIndex === -1) return message.channel.send(`:x: Il n'y a pas de grades d'expérience défini pour ce niveau`);
                    let formerRank = guild.settings?.experience?.ranks.splice(roleIndex);
                    await client.updateGuild(message.guild, guild);
                    await client.ranksUpdate(message.guild, formerRank);
                    return message.channel.send(`:white_check_mark: Le grade du niveau ${roleLevel} a bien été supprimé.`);
                
                default:
                    break;
            };

        case "update":
            await client.ranksUpdate(message.guild);
            return message.channel.send(`:white_check_mark: Mise à jour des grades effectuée`);

        case "maxuse":
            let uses = parseInt(args[0]) || undefined;
            if (!isNaN(uses) && uses) {
                guild.settings.experience.maxUses = uses;
                await client.updateGuild(message.guild, guild);
                return message.channel.send(`:white_check_mark: Le nombre d'incrémentation maximum par minute d'expérience a été défini à \`${guild.settings.experience.maxUses}\``);
            } else {
                return message.channel.send(`Le nombre d'incrémentation maximum par minute d'expérience est actuellement de \`${guild.settings.experience.maxUses}\``);
            };

        case "min":
            let xpMin = parseInt(args[0]) || undefined;
            if (!isNaN(xpMin) && xpMin) {
                guild.settings.experience.xpMin = xpMin;
                await client.updateGuild(message.guild, guild);
                return message.channel.send(`:white_check_mark: Le gain d'expérience minimum a été défini à \`${guild.settings.experience.xpMin}\``);
            } else {
                return message.channel.send(`Le gain d'expérience minimum est actuellement de \`${guild.settings.experience.xpMin}\``);
            };

        case "max":
            let xpMax = parseInt(args[0]) || undefined;
            if (!isNaN(xpMax) && xpMax) {
                guild.settings.experience.xpMax = xpMax;
                await client.updateGuild(message.guild, guild);
                return message.channel.send(`:white_check_mark: Le gain d'expérience maximum a été défini à \`${guild.settings.experience.xpMax}\``);
            } else {
                return message.channel.send(`Le gain d'expérience maximum est actuellement de \`${guild.settings.experience.xpMax}\``);
            };


        default:
            return message.channel.send(`Les arguments spécifiés sont invalides ou inexistants. Utilisation de la commande : \`${guild.settings.prefix}${this.help.name} ${this.help.usage}\``);
    };
};

module.exports.help = {
    name: "experience",
    aliases : ["xp", "exp"],
    category : 'paramètres',
    description: "Permet de gérer l'expérience des membres",
    cooldown: 0,
    usage: "<[reset, multiplier, add, remove, ranks]> <[reset/add/remove:@user, multiplier:[@channel,nothing], ranks:[display, add, remove]]> <add/remove/multiplier[@channel]:Amount, ranks:[add:@role, remove:Level]> <ranks:add:Level>",
    args: true,
    permission: "admin",
};