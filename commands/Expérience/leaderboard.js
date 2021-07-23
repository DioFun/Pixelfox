const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, guild) => {
    let leaderboard = guild.members.sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        else return b.experience - a.experience;
    }).filter(e => e.experience !== 0);
    let pages = Math.ceil(leaderboard.length / 10);
    let pagesContent = [];
    let elements = leaderboard;
    for (let i = 0; i < pages; i++) {
        pagesContent[i] = "";
        for (let index = 0; index < 10; index++) {
            let e = elements.shift(); let begin; let end;
            if (!e) continue;
            if (i === 0 && index === 0) {begin = `**`; end = "** :first_place:";}
            else if (i === 0 && index === 1) {begin = `**`; end = "** :second_place:";}
            else if (i === 0 && index === 2) {begin = `**`; end = "** :third_place:";};
            pagesContent[i] += `${begin ? begin : ""}${i*10+(index+1)}. <@${e.userID}> | Lvl. ${e.level} - ${e.experience} points${end ? end : ""}\n`;
        };                
    };
    let embedDisplay = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`<:leaderboard:862060921719488512> Classement XP <:leaderboard:862060921719488512>`)
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
                embedDisplay.setTitle(`<:leaderboard:862060921719488512> Classement XP <:leaderboard:862060921719488512>`);
                embedDisplay.setDescription(pagesContent[actual]);
                embedDisplay.setFooter(`Page ${actual+1}/${pages}`);
                m.edit(embedDisplay);
            });
        });
    } else {
        message.channel.send(embedDisplay);
    };
    return;
};

module.exports.help = {
    name: "leaderboard",
    aliases : ["lb", "leader"],
    category : 'expérience',
    description: "Permet d'afficher le classement",
    cooldown: 300,
    usage: "",
    args: false,
    permission: false,
};