const guild = require('../../models/guild.js');
const { TStoShortDate } = require('../../tools/date.js');
const { getRndInteger } = require('../../tools/random.js');

module.exports = async (client, member) => {


    if(member.user.bot) return;
    
    // -> Check BDD && Check Ban
    let data = await client.getMember(member, member.guild);
    if (!data){        
        await client.createMember(member, member.guild);
    } else {
        let ban = data.infractions.find(inf => inf.isActive && inf.type === "ban");
        if (ban) {
            if (ban.end !== 0 && ban.end > Date.now()) {
                await member.send(`:x: Vous êtes bannis de ce serveur ! ${ban.end ? `Expire le ${TStoShortDate(ban.end)}` : ``}`).catch(e => console.log(e));
                return member.kick(`Automatique: Tentative de connexion en étant bannis ${ban.end ? `Expire le ${TStoShortDate(ban.end)}` : ``}`);
            } else {
                data.infractions.find(inf => inf.isActive && inf.type === "ban").isActive = false;
                await client.updateMember(member, member.guild, data);
            }
        }
    }
    client.levelCheck(member);
    let guildData = await client.getGuild(member.guild);
    let rdm = getRndInteger(0, guildData.settings.welcomeMessages.length);
    
    let chan = member.guild.channels.cache.get(guildData.settings.welcomeChannel);
    if (!chan) return;

    let message = guildData.settings.welcomeMessages[rdm].replace('{user}', member);

    return chan.send(message);

};