const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, interaction) => {
    let member = interaction.options.get("membre")?.member || interaction.member;
    if (member.user.bot) return interaction.editReply(`:x: Les bots ne gagnent pas d'expérience !`);
    const guild = await client.getGuild(interaction.guild);
    let rank = guild.members.sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        else return b.experience - a.experience;
    }).findIndex(e => e.userID === member.id) + 1;
    if (rank === 1) rank = ":first_place:";
    else if (rank === 2) rank = ":second_place:";
    else if (rank === 3) rank = ":third_place:";
    else rank = `#${rank} -`;
    const data = await client.getMember(member);
    let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`${rank} ${member.displayName}`)
        .addField(`Niveau`, `${data.level}`, true)
        .addField(`Points d'expérience`, `${data.experience}`, true)
        .addField(`Nombre de messages`, `${data.messages}`, true)
        .setThumbnail(member.user.avatarURL());
    return await interaction.editReply({ embeds: [embed] });
};

module.exports.settings = {
    name: "rank",
    ephemeral: false,
};