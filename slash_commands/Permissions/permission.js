const { MessageEmbed } = require("discord.js");
const { filter } = require("../settings");

module.exports.run = async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand();
    const {value: command} = interaction.options.get("commande");
    const commands = await interaction.guild.commands.fetch();
    const commandPermissions = await commands?.find(e => e.name === command).permissions;

    if (subCommand === "view") {
        const fetchCommandPermissions = await commandPermissions.fetch();
        let embed = new MessageEmbed()
            .setTitle(`:pencil: Accès à la commande "${command}"`)
            .setColor("GREEN");
        if (fetchCommandPermissions.find(e => e.permission)) embed.addField(`<:info:866955853160251411> Accès accordé`, fetchCommandPermissions.filter(e => e.permission).sort((a, b) => {
            if (a.type === "USER") return 1;
            else return -1;
        }).map(e => e.type === "USER" ? `<@${e.id}>` : `<@&${e.id}>`).join("\n"));
        if (fetchCommandPermissions.find(e => !e.permission)) embed.addField(`<:prohibited:866955746754953237> Accès refusé`, fetchCommandPermissions.filter(e => !e.permission).sort((a, b) => {
            if (a.type === "USER") return -1;
            else return 1;
        }).map(e => e.type === "USER" ? `<@${e.id}>` : `<@&${e.id}>`).join("\n"));
        return interaction.editReply({embeds: [embed]});
    };

    const mention = interaction.options.get("mention");

    if ((subCommand === "remove" || subCommand === "prohibit") && mention.user?.id === interaction.guild.ownerId) return interaction.editReply(`:x: Vous ne pouvez pas supprimé l'accès à une commande au propriétaire du serveur !`);

    if (await commandPermissions.has({permissionId: `${mention.user ? mention.user.id : mention.role.id}`})) await commandPermissions.remove(mention.user ? {users: mention.user.id} : {roles: mention.role.id});

    if (subCommand === "remove") return interaction.editReply(`:white_check_mark: L'accès à la commande **${command}** a été supprimé à ${mention.user ? mention.member : mention.role}`)
    await commandPermissions.add({permissions: [
        {
            id: mention.user ? mention.user.id : mention.role.id,
            type: mention.user ? "USER" : "ROLE",
            permission: subCommand === "grant" ? true : false
        }
    ]});
    return interaction.editReply(`:white_check_mark: L'accès à la commande **${command}** a été ${subCommand === "grant" ? `accordé` : `interdit`} à ${mention.user ? mention.member : mention.role}`);

};

module.exports.settings = {
    name: "permission",
    ephemeral: false,
};