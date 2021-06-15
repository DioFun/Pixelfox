const { TStoDate } = require("../tools/date");

module.exports = async (client) => {
    client.guilds.cache.forEach(async guild => {
        let birthdays = [];
        let guildData = await client.getGuild(guild)

        for (let i = 0; i < guildData.members.length; i++) {
            const data = guildData.members[i];
            if (!guild.members.cache.find(e => e.id === data.userID) || !data.birthdate) continue;
            let birthday = data.birthdate.split("/");
            birthday = new Date(Date.parse(`${Number.parseInt(birthday[1])}/${Number.parseInt(birthday[0])}${Number.parseInt(birthday[2]) ? `/${Number.parseInt(birthday[2])}` : ``}`));
            let now = new Date(Date.now());
            if(now.getDate() === birthday.getDate() && now.getMonth() === birthday.getMonth()) {
                birthdays.push(data.userID);
            }

        }
        if (birthdays[0]){
            let channel = guild.channels.cache.get(guildData.settings.birthdayChannel);
            if (channel) channel.send(guildData.settings.birthdayMessage.replace("{members}", birthdays.map(e => `<@!${e}>`).join(", ")).replace("{fullDate}", TStoDate(Date.now(), false)));
        } 
    });

} 

module.exports.when = "26 09 * * *";