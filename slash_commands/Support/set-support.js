const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (client, interaction) => {
    const { channel } = interaction.options.get("salon") || interaction;
    if (!channel.isText()) return interaction.editReply(":x: Vous devez sélectionner un salon textuel comme salon où les tickets seront créés");
    let embed = new MessageEmbed()
        .setTitle(`:pencil: Salon de support`)
        .setDescription(`Bienvenue dans le salon ${channel} !\nPour tout(e) **signalement, question, suggestion ou retrait de sanction**, vous pourrez créer un ticket grâce aux boutons ci-dessous ou la commande **/ticket** disponible partout sur le serveur !\n\nVous avez la possibilité de créer des tickets publiques ou privés si ceux-ci sont disponibles sur le serveur ! Merci de choisir judicieusement la catégorie ainsi que l'accessibilité sinon des sanctions pourraient être envisagées !\nPar défaut, en utilisant les boutons les demandes créés seront en privé pour les signalements et retraits de sanction et publique pour le reste.`)
        .setColor("BLUE");

    let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("set-support_report")
                .setLabel("Ticket signalement")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("set-support_question")
                .setLabel("Question")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("set-support_suggest")
                .setLabel("Suggestion")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("set-support_sanction")
                .setLabel("Retrait de sanction")
                .setStyle("PRIMARY")
        );

    let guild = await client.getGuild(interaction.guild);
    guild.settings.supportChannel = channel.id;
    await client.updateGuild(interaction.guild, guild);
    channel.send({embeds: [embed], components: [row]});
    return interaction.editReply(`:white_check_mark: Salon de support défini avec succès !`);
};

module.exports.runButton = async (client, interaction) => {
    let splited = interaction.customId.split("_").slice(1);
    const guild = await client.getGuild(interaction.guild);
    switch (splited[0]) {
        case "suggest":
        case "question":
            var thread = await interaction.channel.threads.create({
                name: `${splited[0] === "question" ? "Question" : "Suggestion"} - ${interaction.user.tag}`,
                autoArchiveDuration: 1440
            });
            var embed = new MessageEmbed()
                .setTitle(`Ticket de support - ${splited[0] === "question" ? "Question" : "Suggestion"}`)
                .setDescription(`${interaction.user}, le ticket de support a bien été créé !\nMerci de formuler votre ${splited[0] === "question" ? "question" : "suggestion"} le plus précisément possible afin qu'un membre du staff puisse vous aider !`)
                .setColor("BLUE");
            var row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-support_close`)
                        .setLabel(`Fermer`)
                        .setStyle("DANGER")
                        .setEmoji("🔒")
                );
            return thread.send({content: `${interaction.user}${guild.settings.staffRoleID ? `, ${guild.settings.staffRoleID}` : ``}`,embeds: [embed], components: [row]});

        case "report":
        case "sanction":
            var thread = await interaction.channel.threads.create({
                name: `${splited[0] === "report" ? "Signalement" : "Retrait de sanction"} - ${interaction.user.tag}`,
                autoArchiveDuration: 1440,
                type: "GUILD_PRIVATE_THREAD"
            });
            var embed = new MessageEmbed()
                .setTitle(`Ticket de support - ${splited[0] === "report" ? "Signalement" : "Retrait de sanction"}`)
                .setColor("BLUE");

                if (splited[0] === "report") embed.setDescription(`${interaction.user}, le ticket de support a bien été créé !\nMerci de formuler votre signalement le plus précisément possible afin qu'un membre du staff puisse vous aider !`);
                else embed.setDescription(`${interaction.user}, le ticket de support a bien été créé !\nMerci d'expliquer le plus précisémment possible pourquoi vous souhaitez que votre sanction soit levée afin que votre demande soit traitée par le staff le plus facilement et rapidement possible !`);

            var row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-support_close`)
                        .setLabel(`Fermer`)
                        .setStyle("DANGER")
                        .setEmoji("🔒")
                );
            return thread.send({content: `${interaction.user}${guild.settings.staffRoleID ? `, ${guild.settings.staffRoleID}` : ``}`,embeds: [embed], components: [row]});
        case "close": 
            if(!interaction.channel.isThread()) return;
            await interaction.channel.send(`Ticket archivé par ${interaction.user}`);
            interaction.channel.setArchived();
            interaction.editReply(":white_check_mark: Le ticket a été archivé !");
    };
    
    
};

module.exports.settings = {
    name: "set-support",
    ephemeral: true,
};