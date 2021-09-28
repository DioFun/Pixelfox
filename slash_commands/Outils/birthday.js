module.exports.run = async (client, interaction) => {
    let member = interaction.options.get("member")?.member || interaction.member;
    if (member.user.bot) return interaction.editReply(`:x: Les bots ne possèdent pas d'anniversaire !`);
    const data = await client.getMember(member);
    const birthday = data.birthdate;
    if (!birthday) return interaction.editReply(`${member.id === interaction.member.id ? `:x: Vous n'avez pas défini votre date d'anniversaire !` : `:x: ${member.displayName} n'a pas défini sa date d'anniversaire !`}`);
    return interaction.editReply(`${member.id === interaction.member.id ? `Votre date d'anniversaire est définie au **${birthday}** !` : `La date d'anniversaire de ${member.displayName} est définie au **${birthday}** !`}`);
};

module.exports.settings = {
    name: "birthday",
    ephemeral: true,
};