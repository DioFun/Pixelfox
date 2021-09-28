module.exports.run = async (client, interaction) => {
    /*let commands = await interaction.guild.commands.fetch().map(e => e);
    let others = require("../settings");
    console.log(commands === others);
    console.log(commands, others);*/
    //interaction.guild.commands.set([]);
    console.log(await interaction.guild.members.fetch());
    interaction.editReply("OK");
};

module.exports.settings = {
    name: "check",
    ephemeral: true,
};