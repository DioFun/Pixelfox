module.exports = client => {
    client.levelCheck = async member => {
        let data = await client.getMember(member, member.guild);
        let newLevel = Math.floor(0.21915*data.experience**0.43331);
        let formerLevel = data.level;
        data.level = newLevel;
        let guild = await client.getGuild(member.guild);
        if (guild.settings.experience?.ranks?.length !== 0){ 
            let ranks = guild.settings.experience?.ranks?.filter(e => e.level <= newLevel).sort((a, b) => { return b.level - a.level; });
            let newRank = ranks[0] || undefined;
            if (!member.roles.cache.find(e => e.id === newRank?.id) || newRank === undefined) {
                guild.settings.experience?.ranks?.forEach(e => {
                    let role = member.roles.cache.find(role => role.id === e.id) || undefined;
                    if (role) member.roles.remove(role);
                });
                if (newRank !== undefined) member.roles.add(newRank.id);
            };
        };
        await client.updateMember(member, member.guild, data);
        if (formerLevel !== data.level) return {message: guild.settings?.experience?.levelUpMessage?.replace(/{user}/g, member).replace(/{level}/g, data.level)};
        return;
    };

    client.ranksUpdate = async (guild, formerRanks = undefined) => {
        let data = await client.getGuild(guild);
        for (let i = 0; i < data.members.length; i++) {
            data.members[i].level = Math.floor(0.21915*data.members[i].experience**0.43331);
            const member = data.members[i];
            let guildMember = guild.members.cache.find(e => e.id === member.userID);
            if (!guildMember) continue;
            if (data.settings.experience?.ranks?.length !== 0){ 
                let ranks = data.settings.experience?.ranks?.filter(e => e.level <= member.level).sort((a, b) => { return b.level - a.level; });
                let newRank = ranks[0] || undefined;
                if (!guildMember.roles.cache.find(e => e.id === newRank?.id) || newRank === undefined) {
                    let delRanks = formerRanks || data.settings.experience?.ranks;
                    delRanks.forEach(e => {
                        let role = guildMember.roles.cache.find(role => role.id === e.id) || undefined;
                        if (role) guildMember.roles.remove(role);
                    });
                    if (newRank !== undefined) guildMember.roles.add(newRank.id);
                };
            };
        }
        await client.updateGuild(guild, data);
    };
};