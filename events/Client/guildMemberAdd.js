const { TStoShortDate } = require('../../tools/date.js');
const { getRndInteger } = require('../../tools/random.js');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, member) => {
    // -> Logs init
    if (!member.guild) return;
    let dataGuild = await client.getGuild(member.guild);
    if (!dataGuild || !dataGuild?.settings?.logChannel) return;
    let logChannel = member.guild.channels.cache.find(e => e.id === dataGuild.settings.logChannel);
    if (!logChannel) return;
    if(member.user.bot) {
        let fetchGuildAuditLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: "BOT_ADD"
        });
        const latestBotAdded = fetchGuildAuditLogs.entries.first();
        if (!latestBotAdded) return;
        var embed = new MessageEmbed()
            .setTitle(`<:arrow_join:866959118073856001> Bot ajouté`)
            .setDescription(`${latestBotAdded.executor} a ajouté le bot ${member} au serveur !`)
            .setFooter(`ID du bot: ${member.id}`)
            .setColor("GREEN")
            .setTimestamp(member.joinedTimestamp);
        return logChannel.send(embed)
    };
    
    // -> Check BDD && Check Ban
    let data = await client.getMember(member, member.guild);
    if (!data){        
        await client.createMember(member, member.guild);
    } else {
        let ban = data.infractions.find(inf => inf.isActive && inf.type === "ban");
        if (ban) {
            if (ban.end !== 0 && ban.end > Date.now()) {
                await member.send(`:x: Vous êtes bannis de ce serveur ! ${ban.end ? `Expire le ${TStoShortDate(ban.end)}` : ``}`).catch(e => console.log(e));
                return member.kick(`Automatique: Tentative de connexion en étant banni ${ban.end ? `Expire le ${TStoShortDate(ban.end)}` : ``}`);
            } else {
                data.infractions.find(inf => inf.isActive && inf.type === "ban").isActive = false;
                await client.updateMember(member, member.guild, data);
            }
        }
    }
    client.levelCheck(member);
    let rdm = getRndInteger(0, dataGuild.settings.welcomeMessages.length);
    
    let chan = member.guild.channels.cache.get(dataGuild.settings.welcomeChannel);
    if (chan){
        let message = dataGuild.settings.welcomeMessages[rdm].replace('{user}', member);
        chan.send(message);
    }

    // -> Logs end
    var embed = new MessageEmbed()
        .setTitle(`<:arrow_join:866959118073856001> Nouveau membre`)
        .setDescription(`${member} a rejoint le serveur !`)
        .setFooter(`ID du membre: ${member.id}`)
        .setColor("GREEN")
        .setTimestamp(member.joinedTimestamp);

    return logChannel.send(embed);

};