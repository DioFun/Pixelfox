const { MessageEmbed } = require("discord.js");

const ids = [
    {
        icon: "<:switch_logo:832990603926831134>",
        name: "nintendo",
        displayName: "Nintendo Switch",
        accountName: "une Nintendo Switch",
        codeName: "code d'ami Nintendo Switch",
        color: `RED`,
        format: /SW(-[0-9]{4}){3}/,
        example: "SW-1234-5678-9123"
    },
    {
        icon: "<:xbox_logo:832991123324665896>",
        name: "xbox",
        displayName: "Xbox",
        accountName: "un compte Xbox",
        codeName: "GamerTag",
        color: `#107b10`,
        format: /.{3,16}/,
        example: "Pseudo"
    },
    {
        icon: "<:playstation_logo:832990867949486130>",
        name: "playstation",
        displayName: "Playstation",
        accountName: "un compte Playstation Network",
        codeName: "Pseudo PSN",
        color: `#005aa7`
    },
    {
        icon: "<:epic_logo:832992463442542592>",
        name: "epic_games",
        displayName: "Epic Games",
        accountName: "un compte Epic Games",
        codeName: "pseudo Epic Games"
    },
    {
        icon: "<:steam_logo:832989455077081089>",
        name: "steam",
        displayName: "Steam",
        accountName: "un compte Steam",
        codeName: "code d'ami Steam",
        color: `#171a21`,
        format: /[0-9]{8,}/,
        example: "123456789"
    },
    {
        icon: "<:ubi_logo:832992374459858964>",
        name: "ubisoft",
        displayName: "Ubisoft Connect",
        accountName: "un compte Ubisoft Connect",
        codeName: "pseudo Ubisoft Connect",
        color: `#ff665b`,
        format: /[a-zA-Z][0-9a-zA-Z\-\_\.]{2,14}/,
        example: "Pseudo"
    },
    {
        icon: "<:origin_logo:832989456066674708>",
        name: "origin",
        displayName: "Origin",
        accountName: "un compte Origin",
        codeName: "pseudo Origin",
        color: `ORANGE`
    },
    {
        icon: "<:rockstar_logo:832991323778187275>",
        name: "rockstar",
        displayName: "Rockstar",
        accountName: "un compte Rockstar",
        codeName: "pseudo Rockstar",
        color: `#fba800`,
        format: /[a-zA-Z0-9_-]{6,16}/,
        example: "Pseudo"
    },
    {
        icon: "<:gog_logo:832991666461868052>",
        name: "gog",
        displayName: "GOG",
        accountName: "un compte GOG",
        codeName: "pseudo GOG",
        color: `#5b2f97`,
    },
    {
        icon: "<:battlenet_logo:832990361524764732>",
        name: "battlenet",
        displayName: "Battle.net",
        accountName: "un compte Battle.net",
        codeName: "Battle Tag",
        color: `#1d9fdb`,
        format: /[A-Za-z\xc0-\xcf\xd1-\xd6\xd9-\xdd\xe0-\xf6\xf9-\xfd\xff][A-Za-z0-9\xc0-\xcf\xd1-\xd6\xd9-\xdd\xe0-\xf6\xf9-\xfd\xff]{2,11}#[0-9]{4,}/,
        example: "Pseudo#12345"
    },
    {
        icon: "<:riot_logo:832992026885619744>",
        name: "riot",
        displayName: "Riot",
        accountName: "un compte Riot",
        codeName: "Riot ID",
        color: `#cc2831`,
        format: /.+?#[0-9]{4}|.+?#[A-Z]{3}/,
        example: "Pseudo#1234 ou Pseudo#ABC"
    }
];

module.exports.run = async (client, message, args, guild) => {

    if (!args[0] || ((message.mentions.members.first() || message.guild.members.cache.find(e => (e.id === args[0] || e.user.username.toLowerCase() === args[0].toLowerCase() || e.displayName.toLowerCase().includes(args[0].toLowerCase())) && !e.user.bot)) && args[0].toLowerCase() !== "set")) {
        let member;
        if (!args[0]) member = message.member; 
        else member = message.mentions.members.first() || message.guild.members.cache.find(e => e.id === args[0] || e.user.username.toLowerCase() === args[0].toLowerCase() || e.displayName.toLowerCase().includes(args[0].toLowerCase()));
        let data = await client.getMember(member, member.guild);
        if (!data || !data.profile) return message.channel.send(member === message.member ? `:x: Vous n'avez pas encore créé votre profil ! Pour le créer faites \`${guild.settings.prefix}${this.help.name} set\`` : `:x: ${member.displayName} n'a pas encore créé son profil !`);

        let embed = new MessageEmbed()
            .setTitle(`Profil de ${member.displayName}`)
            .setColor(`Orange`);

        for (const key in data.profile) {
            if (Object.hasOwnProperty.call(data.profile, key)) {
                const e = data.profile[key];
                const infos = ids.find(e => e.name === key);
                embed.addField(`${infos.icon} ${infos.displayName}`, e, true);
            }
        }

        return message.channel.send(embed);

    }  else if (args[0].toLowerCase() === "set") {
        message.channel.send(`Un message privé vous a été envoyé afin de configurer votre profil !`)
        let embed = new MessageEmbed()
            .setTitle(`:tools: Configuration du profil pour \`${message.guild.name}\` :tools:`)
            .setDescription(`<:emojiflche:832398709878685747> Vous allez configurer votre profil.\n<:emojiflche:832398709878685747> Quand une réaction vous sera demandée vous aurez 30 secondes pour faire votre choix.\n<:emojiflche:832398709878685747> Vous aurez 3 minutes à chaque fois pour envoyer vos codes d'amis.\n<:emojiflche:832398709878685747> Le format indiqué est à respecter, en cas de soucis de format il vous sera redemandé de saisir votre code au bon format.\n\nQuand vous êtes prêt à commencer, réagissez avec :white_check_mark:`);

        message.member.send(embed)
            .then(async m => {
                m.react("✅");
                let filter = (reaction, user) => reaction.emoji.name === "✅" && user.id == message.member.id;

                m.awaitReactions(filter, {max: 1, time: 30000})
                    .then(async collected => {
                        if (collected.size === 0) return mess.channel.send(":x: Configuration de votre profil annulée !");
                        let data = await client.getMember(message.member, message.guild);
                        let has;
                        let cancel = false;
                        for (let i = 0; i < ids.length; i++) {
                            if (cancel === true) return;
                            const e = ids[i];
                            has = true;
                            if (!data.profile) data.profile = {};
                            await message.member.send(data.profile[e.name] ? `Souhaitez vous changer votre ${e.codeName} ? Actuel : \`${data.profile[e.name]}\`` :`Possèdez-vous ${e.accountName} ?`)
                                .then(async m => {
                                    m.react("✅");
                                    m.react("❌");
                                    if (data.profile[e.name]) m.react("🗑️");
                                    filter = (reaction, user) => (reaction.emoji.name === "✅" || reaction.emoji.name === "❌" || reaction.emoji.name === "🗑️") && user.id == message.member.id;
                                    await m.awaitReactions(filter, {max: 1, time: 30000})
                                        .then(collected => {
                                            if (collected.size === 0) {cancel = true; return m.channel.send(":x: Configuration de votre profil annulée !")};
                                            if (collected.first().emoji.name === "❌") has = false;  
                                            if (collected.first().emoji.name === "🗑️" && data.profile[e.name]) {delete data.profile[e.name]; has = false;};
                                        });
                                })
                            if (has && !cancel) {
                                let desc = `Quel est votre ${e.codeName} ? ${e.format ? `\nLe format exigé est \"${e.example}\"` : ``} ${data.profile[e.name] ? `\nLe code actuellement renseigné est \`${data.profile[e.name]}\`.` : ``}\nSi vous ne souhaitez pas le modifier répondez par \`Non\``;
                                embed = new MessageEmbed()
                                    .setTitle(`${e.icon} ${e.displayName}`)
                                    .setDescription(desc)
                                    .setColor(e.color ? e.color : `#23272A`);
                                await m.channel.send(embed)
                                    .then(async m => {
                                        filter = m => m.author.id === message.member.id;
                                        let stop = true;
                                        do {
                                            stop = true;
                                            await m.channel.awaitMessages(filter, {max: 1, time: 180000})
                                                .then(collected => {
                                                    if (collected.size === 0) {cancel = true; return m.channel.send(":x: Configuration de votre profil annulée !")};
                                                    let id = collected.first();
                                                    if (id.content.toLowerCase() === "non") return m.channel.send(`Modification du ${e.codeName} annulée !`);
                                                    if (e.format) {
                                                        if (!id.content.match(e.format) || id.content.match(e.format)[0] !== id.content) {
                                                            stop = false;
                                                            m.channel.send(`:x: Le format renseigné ne correspond pas aux critères ! Renseignez en un de nouveau !`);
                                                        }
                                                    }                               
                                                    if (stop) {
                                                        data.profile[e.name] = id.content;
                                                        m.channel.send(`:white_check_mark: ${e.codeName} défini à \`${data.profile[e.name]}\``);
                                                    }                    

                                                });
                                        } while (stop === false);                                        
                                    })
                            };
                        };

                        let embed1 = new MessageEmbed()
                            .setTitle(`Profil de ${message.member.displayName}`)
                            .setFooter(`Pour confirmer votre profil, réagissez avec ✅. Sinon Régaissez avec ❌, le profil sera alors complétement supprimé. Vous avez 60 secondes !`)
                            .setColor(`Orange`);

                        for (const key in data.profile) {
                            if (Object.hasOwnProperty.call(data.profile, key)) {
                                const e = data.profile[key];
                                const infos = ids.find(e => e.name === key);
                                embed1.addField(`${infos.icon} ${infos.displayName}`, e, true)
                            }
                        }

                        await message.member.send(embed1)
                            .then(async m => {
                                m.react("✅");
                                m.react("❌");
                                const filter = (reaction, user) => (reaction.emoji.name === "✅" || reaction.emoji.name === "❌") && user.id == message.member.id;
                                await m.awaitReactions(filter, {max: 1, time: 60000})
                                    .then(async collected => {
                                        if (collected.size === 0) return message.channel.send(":x: Configuration de votre profil annulée !");
                                        if (collected.first().emoji.name === "❌") return m.channel.send("Les changements apportés n'ont pas été pris en compte !");
                                        await client.updateMember(message.member, message.guild, data);
                                        return m.channel.send(`:white_check_mark: Les changements apportés ont bien été pris en compte !`);
                                    })
                            })


                    });
                    
            });

        

    } else {
        return message.channel.send(`:x: Mauvaise utilisation de la commande ! Utilisation : \`${guild.settings.prefix}${this.help.name} ${this.help.usage}\``);
    }

};

module.exports.help = {
    name: "profile",
    aliases : ["profile"],
    category : 'outils',
    description: "",
    cooldown: 0,
    usage: '([@user, set])',
    args: false,
    permission: false,
};


