const { MessageEmbed } = require('discord.js');
const { BackMessage } = require('../../class/BackMessage.js');
const { TStoShortDate } = require('../../tools/date.js');
const { hasPermission } = require('../../tools/permissions.js');

module.exports.run = async (client, message, args, guild) => {

    let member = (message.mentions.members.first() || message.guild.members.cache.find(e => e.displayName.toLowerCase().includes(args[0].toLowerCase()) || e.user.username.toLowerCase().includes(args[0].toLowerCase()) || e.id === args[0]));
    if(!member) return new BackMessage("error", `Vous n'avez pas spécifié d'utilisateur !`);
    let memberData = await client.getMember(member, message.guild);
    const record = memberData.infractions;

    if (args[1]?.toLowerCase() === "remove" && hasPermission(client, message.member, "admin")) {
        let date = new Date(Date.parse(`${args[2].split("/")[1]}/${args[2].split("/")[0]}/${args[2].split("/")[2]}`));
        const match = record.filter(e => {
            let infractionDate = new Date(e.date);
            if (infractionDate.getDate() === date.getDate() && infractionDate.getMonth() === date.getMonth() && infractionDate.getYear() === date.getYear()) return true;
            else return false;
        });
        if (!match.length) return new BackMessage(`error`, `Il n'y a aucune infraction enregistrée à cette date pour ${member}`)
        if (match.length > 1) {
            let embed = new MessageEmbed()
                .setColor(`ORANGE`)
                .setTitle(`Infractions du ${TStoShortDate(date, false)}`)
                .setThumbnail(member.user.avatarURL())
                .setDescription(`Quel infraction souhaitez-vous supprimer ? `)
                .addField(`Liste`, match.map((e, i) => `${i+1}. ${e.type[0].toUpperCase() + e.type.substr(1)} : ${e. reason ? `${e.reason} -` : ``}${TStoShortDate(e.date)}`).join(`\n`));

            await message.channel.send(embed).then(async m =>{
                let answers = await m.channel.awaitMessages(m => m.member.id === message.member.id && !isNaN(Number.parseInt(m.content) && match.length >= Number.parseInt(m.content) > 0), {time: 30000, max: 1});
                if (!answers.first()) return;
                let index = record.indexOf(match[Number.parseInt(answers.first().content)-1]);
                memberData.infractions.splice(index,1);
            });

        } else if (match.length === 1) {
            memberData.infractions.splice(record.indexOf(match[0]), 1);
        };
        await client.updateMember(member, message.guild, memberData);
        return new BackMessage("success", `La sanction a bien été supprimée !`);

    } else if (args[1]?.toLowerCase() === "clear" && hasPermission(client, message.member, "admin")) {
        if (record.length === 0) return new BackMessage("error", `${member} n'a aucune infraction !`);

        memberData.infractions = [];
        await client.updateMember(member, message.guild, memberData);

        return new BackMessage("success", `Les infractions de ${member} ont été supprimées !`);

    } else if (args[1]?.toLowerCase() === "display") {

        let pages = Math.ceil(record.length / 10);
        let pagesContent = [];
        let elements = record;
        for (let i = 0; i < pages; i++) {
            pagesContent[i] = "";
            for (let index = 0; index < 10; index++) {
                let e = elements.shift(); let begin; let end;
                if (!e) continue;
                pagesContent[i] += `**${e.type[0].toUpperCase() + e.type.substr(1)}** : ${e.reason ? `${e.reason}` : `Aucune raison`}\n => ${e.isActive ? `Actif` : `Passée`} ${TStoShortDate(e.date)}${e.end ? ` -> ${TStoShortDate(e.end)}` : ``}\n`;
            };                
        };
        let embedDisplay = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle(`Sanctions de ${member.displayName}`)
            .setDescription(pagesContent[0])
            .setFooter(`Page 1/${pages} - demandé par ${message.member.displayName}`);
        if (pages > 1){
            let actual = 0;
            await message.channel.send(embedDisplay).then(m => {
                m.react("⬅️"); m.react("➡️");
                const collector = m.createReactionCollector((reaction, user) => (reaction.emoji.name === "➡️" || reaction.emoji.name === "⬅️") && !user.bot && user.id === message.member.id, {time: 600000});
                collector.on('collect', (r, user) => {
                    r.users.remove(user);
                    if (r.emoji.name === "➡️") actual = actual+1;
                    else actual = actual-1;
                    if (actual < 0 || actual > pages-1) return;
                    embedDisplay.setTitle(`Sanctions de ${member.displayName}`);
                    embedDisplay.setDescription(pagesContent[actual]);
                    embedDisplay.setFooter(`Page ${actual+1}/${pages}`);
                    m.edit(embedDisplay);
                });
            });
        } else {
            message.channel.send(embedDisplay);
        };
        return;

    } else {

        //let lastInfractions = record.length >= 10 ? record.slice(record.length-10, record.length) : record
        
        let embed = new MessageEmbed()
            .setTitle(`Infractions de ${member.user.tag}`)
            .setColor("ORANGE")
            .setThumbnail(member.user.avatarURL())
            .addFields([
                {name: `Total`, value: record.length, inline: true},
                {name: `Bannissements`, value: record.filter(e => e.type === "ban").length, inline: true},
                {name: `Avertissements`, value: record.filter(e => e.type === "warn").length, inline: true},
                {name: `Réductions au silence`, value: record.filter(e => e.type === "mute").length, inline: true},
                {name: `Expulsions`, value: record.filter(e => e.type === "kick").length, inline: true}
            ]);

        return new BackMessage("custom", embed);

    }
    
};

module.exports.help = {
    name: "infractions",
    aliases : ["infractions"],
    category : 'moderation',
    description: "Affiche les infractions d'un membre. Permet aux administrateurs de supprimer l'entièreté des infractions d'un utilisateur ou certaines.",
    cooldown: 0,
    usage: "<@user> ([clear])",
    args: true,
    permission: "staff",
};

/**
 * 
            .addFields([
                {name: `Total`, value: record.length, inline: true},
                {name: `Bannissements`, value: record.filter(e => e.type === "ban").length, inline: true},
                {name: `Avertissements`, value: record.filter(e => e.type === "warn").length, inline: true},
                {name: `Réductions au silence`, value: record.filter(e => e.type === "mute").length, inline: true},
                {name: `Expulsions`, value: record.filter(e => e.type === "kick").length, inline: true},
                {name: `Dernières Infractions`, value: lastInfractions.length ? lastInfractions.map(e => `**${e.type}** : ${e.reason} - ${TStoShortDate(e.date)}`) : `Aucune infraction`}
            ]);
 */