const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

const InteractionPaginate = (title, interaction, elements, numberOfElementsByPage = 10, time = 15000, color = "ORANGE") => {
    if (!title || !interaction || !elements) throw `Arguments Missing in interactionPaginate function`;
    const pages = Math.ceil(elements.length / numberOfElementsByPage);
    let pagesContent = [];
    for (let i = 0; i < pages; i++) {
        pagesContent[i] = elements.slice(i*numberOfElementsByPage, i*numberOfElementsByPage+(numberOfElementsByPage)).join("\n");
    };
    console.log(pagesContent)
    let embed = new MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(pagesContent[0])
        .setFooter(`Page 1/${pages} - demandé par ${interaction.member.displayName}`)
        .setThumbnail(interaction.guild.iconURL());

    if (pages === 1) return interaction.editReply({embeds: [embed]});

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("previous")
                .setLabel("Précédent")
                .setEmoji("⬅️")
                .setStyle("PRIMARY")
                .setDisabled(true),
            new MessageButton()
                .setCustomId("next")
                .setLabel("Suivant")
                .setEmoji("➡️")
                .setStyle("PRIMARY")
        );
    interaction.editReply({embeds: [embed], components: [row]});
    let actual = 0;
    const filter = i => (i.customId === "previous" || i.customId === "next") && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({filter: filter, time: time});
    collector.on("collect", i => {
        if (i.customId === "previous") {
            actual--;
            if (actual === 0) row.components.find(b => b.customId === "previous").setDisabled(true);
            row.components.find(b => b.customId === "next").setDisabled(false);

        } else {
            actual++;
            if (actual === pages-1) row.components.find(b => b.customId === "next").setDisabled(true);
            row.components.find(b => b.customId === "previous").setDisabled(false);
        };
        embed.setDescription(pagesContent[actual])
        .setFooter(`Page ${actual+1}/${pages} - demandé par ${interaction.member.displayName}`);
        return i.update({embeds: [embed], components: [row]});
    });
    collector.on("end", () => {
        row.components.forEach(b => {
            b.setDisabled(true);
        });
        interaction.editReply({components: [row]});
    });
        
        
};

module.exports = {
    InteractionPaginate,
};