module.exports = async (client, interaction) => {
    if (!interaction.inGuild() || !interaction.guild?.available) return;
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        await interaction.defer({ephemeral: command.settings.ephemeral});
        await command.run(client, interaction);
    }else if (interaction.isButton()) {
        if (interaction.customId === "previous" || interaction.customId === "next") return;
        if (!interaction.channel || (interaction.channel?.isThread() && interaction.channel.archived)) return;
        const command = client.slashCommands.get(interaction.customId.split("_").shift());
        if (!command) return interaction.reply(":x: Une erreur est survenue !");
        await interaction.defer({ephemeral: true});
        await command.runButton(client, interaction);
    };
};