const { InteractionPaginate } = require("../../tools/pagination");
module.exports.run = async (client, interaction) => {
    const guild = await client.getGuild(interaction.guild);

    let leaderboard = guild.members.sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        else return b.experience - a.experience;
    }).filter(e => e.experience !== 0);

    return InteractionPaginate(`:trophy: Classement XP :trophy:`, interaction, leaderboard.map((member, i) => {
        let begin; let end;
        if (i === 0) {begin = `**`; end = "** :first_place:";}
        else if (i === 1) {begin = `**`; end = "** :second_place:";}
        else if (i === 2) {begin = `**`; end = "** :third_place:";};
        return `${begin ? begin : ""}${i+1}. <@${member.userID}> | Lvl. ${member.level} - ${member.experience} points${end ? end : ""}`;
    }), 3, 600000);
};

module.exports.settings = {
    name: "leaderboard",
    ephemeral: false,
};