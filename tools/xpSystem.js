module.exports = client => {
    client.levelCheck = async member => {
        let data = await client.getMember(member, member.guild);
        let newLevel = Math.floor(0.21915*data.experience**0.43331);
        if (newLevel !== data.level) {
            data.level = newLevel;
            let guild = await client.getGuild(member.guild);
            if (guild.settings.experience?.ranks?.length !== 0){ 
                let ranks = guild.settings.experience?.ranks?.filter(e => e.level <= newLevel).sort((a, b) => { return b.level - a.level; });
                let newRank = ranks[0] || undefined;
                if (!member.roles.cache.find(e => e.id === newRank?.id) || newRank === undefined) {
                    guild.settings.experience?.ranks?.forEach(e => {
                        let role = member.roles.cache.find(role => role.id === e.id) || undefined
                        if (role) member.roles.remove(role);
                    });
                    if (newRank !== undefined) member.roles.add(newRank.id);
                };
            } 
            await client.updateMember(member, member.guild, data);
            return {message: guild.settings?.experience?.levelUpMessage?.replace(/{user}/g, member).replace(/{level}/g, data.level)};
        }
    };
};