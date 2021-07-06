const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, guild) => {
    let leaderboard = guild.members.sort((a, b) => {
        if (b.level !== a.level) {
              return b.level - a.level
        } else {
            return b.experience - a.experience
        }
    });
    let pages = Math.ceil(leaderboard.length / 10);
    let pagesContent = [];
    let elements = leaderboard;
    let ranking = 1;
    for (let i = 0; i < pages; i++) {
        pagesContent[i] = "";
        for (let index = 0; index < 10; index++) {
            let e = elements.shift();
            if (e) pagesContent[i] += `${ranking}. <@${e.userID}> | Lvl. ${e.level} - ${e.experience} points\n`;
            ranking++;
        };                
    };
    let embedDisplay = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`🎖️ Classement XP 🎖️`)
        .setDescription(pagesContent[0])
        .setFooter(`Page 1/${pages}`);
    if (pages > 1){
        let actual = 0;
        await message.channel.send(embedDisplay).then(m => {
            m.react("⬅️"); m.react("➡️");
            const collector = m.createReactionCollector((reaction, user) => (reaction.emoji.name === "➡️" || reaction.emoji.name === "⬅️") && !user.bot, {time: 600000});
            collector.on('collect', (r, user) => {
                r.users.remove(user);
                if (r.emoji.name === "➡️") actual = actual+1;
                else actual = actual-1;
                if (actual < 0 || actual > pages-1) return;
                embedDisplay.setTitle(`🎖️ Classement XP 🎖️`);
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