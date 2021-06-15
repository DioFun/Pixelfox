const { TStoDate } = require('../../tools/date.js');
const { MessageEmbed } = require('discord.js');
const { hasPermission } = require('../../tools/permissions.js');

module.exports.run = async (client, message, args) => {

    if (message.mentions.members.first() && hasPermission(client, message.member, "staff")) {
        const member = message.mentions.members.first();
        let memberData = await client.getMember(member, message.guild);
        const locker = memberData.infractions;
        let embedmember = new MessageEmbed()
            .setTitle(`Informations concernant ${member.user.tag}`)
            .setColor("ORANGE")
            .addFields([
                {name: "ID de l'utilisateur", value: member.user.id, inline: true},
                {name: "Rôles de l'utilisateur", value: member.roles.cache.filter(e => e.id != message.guild.id).size ? member.roles.cache.filter(e => e.id != message.guild.id).map(e => e.name).join(", ") : `Aucun`, inline: true},
                {name: "Infractions sur le serveur", value: locker.length ? locker.length > 1 ? `${locker.length} sanctions` : `1 sanction` : `Aucune sanction`, inline: true},
                {name: "Création", value: `Compte créé le ${TStoDate(member.user.createdAt)}`, inline: true},
                {name: "Arrivée", value: `A rejoint le serveur le ${TStoDate(member.joinedAt)}`, inline: true}
            ]);

        if (member.premiumSince) embedmember.addField("Boost", `Boost le serveur depuis le ${TStoDate(member.premiumSince)}`);

        return message.channel.send(embedmember);

    }

    switch(args[0].toLowerCase()){
        case 'vip':
            let embedvip = new MessageEmbed()
                .setTitle('Informations sur le rôle VIP')
            .addField('Avantages :', "- Place plus haute dans la liste des membres\n- Possibilité d'enregistrer une conversation en utilisant !record et !stop-recording\n- Accès aux Blind Test en utilisant !start-quiz\n- Accès à la Tanière de PixelFox")
                .addField('Obtention', '- Être ami avec un administrateur ou modérateur\n- Avoir fait partie du staff\n- Avoir atteint le niveau 25 sur le serveur')
                .setColor('ORANGE');

            return message.channel.send(embedvip);

        case 'radio':
            let embedradio = new MessageEmbed()
                .setTitle('Informations sur la Radio de PixelFox')
                .addField("Qu'est-ce que c'est ?", "La Radio PixelFox est la radio personnalisée du serveur et est accessible 24h/24, 7j/7. Sa particularité : tous les membres peuvent y contribuer en ajoutant des musiques, quels que soient les genres. \nElle est diffusée par "+ client.user.username +".\nPour l'écouter, il suffit de rejoindre le salon vocal \"Radio PixelFox\" !")
                .addField('Comment contribuer au projet ?', "Pour ajouter des musiques à la Radio, il vous suffit de nous envoyer vos musiques ici : https://bit.ly/3f96uYi \nNote : il est possible que la Radio cesse de fonctionner de façon imprévue. Si cela arrive, merci de nous le dire dans #parler-au-staff !")
                .setColor('ORANGE');

            return message.channel.send(embedradio);

        case 'boost':
            let embedboost = new MessageEmbed()
                .setTitle("Informations sur les avantages des Boosts du serveur")
                .addField("Avantages", "- Toute notre gratitude <3\n- Tous les avantages Discord par défaut (icône à côté du pseudo, badge évolutif sur le profil, progression dans le niveau de Server Boost)\n- Rôle Fan n°1\n- Annonce de remerciement\n- Accès à la Tannière de PixelFox")
                .addField("Durée des avantages", "Le boost s'interrompt après un mois si l'abonnement n'est plus effectif. \nLe rôle Fan n°1 sera donc perdu *(mais pas notre gratitude !)*\n\n\n*P.S. : Merci à ceux qui boostent et boosteront le serveur !*")
                .setColor('ORANGE');

            return message.channel.send(embedboost);

        case 'serveur':
            const guild = message.guild;
            let embedserveur = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle(`Informations sur ${guild.name}`)
                .addFields([
                    {name: "Propriétaire", value: guild.owner.user.tag, inline: true},
                    {name: "Création", value: `Serveur créé le ${TStoDate(guild.createdAt)}`, inline: true},
                    {name: "Nombre de rôles", value: guild.roles.cache.size, inline: true},
                    {name: "Membres", value: `${guild.memberCount} membres (dont ${guild.members.cache.filter(e => e.user.bot).size} bots)\n${guild.members.cache.filter(e => e.presence.status === "online" || e.presence.status === "dnd").size} en ligne (dont ${guild.members.cache.filter(e => e.user.bot && (e.presence.status === "online" || e.presence.status === "dnd")).size} bots)`, inline: true},
                    {name: "Salons", value: `${guild.channels.cache.size} salons au total (${guild.channels.cache.filter(e => e.type === "category").size} catégories, ${guild.channels.cache.filter(e => e.type === "text").size} textuels et ${guild.channels.cache.filter(e => e.type === "voice").size} vocaux)`, inline: true},
                    {name: "Niveau de Boost", value: guild.premiumTier, inline: true},
                    {name: "Nombre de Boosts", value: guild.premiumSubscriptionCount, inline: true}
                ])
                .setThumbnail(guild.iconURL())
                .setFooter(`ID du serveur: ${guild.id}`);

            return message.channel.send(embedserveur);

        default:
            return message.channel.send(`Les arguments spécifiés sont invalides ou inexistants. Utilisation de la commande : \`${client.settings.prefix}${this.help.name} ${this.help.usage}\``);
    }
};

module.exports.help = {
    name: "informations",
    aliases: ["infos", "infs"],
    category : 'important',
    description: "Affiche des panneaux d'aides sur certains sujets, ainsi que des informations sur un membre en particulier",
    usage: "<[vip,radio,boost,serveur,@user]>",
    args: true,
    permission: false,
};