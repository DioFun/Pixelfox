const { MessageEmbed, Collection} = require("discord.js");
const cron = require("node-cron");
const { downloadImage } = require("picture_downloader_tool");
const fs = require("graceful-fs");
const display = ["", "jour", "semaine", "mois", "an"];

module.exports.run = async (client, message, args, guild) => {
    switch (args.shift()) {
        case "add":
            if (!args[0]) return message.channel.send(`:x: Mauvaise utilisation de la commande ! Ultilisation de la commande : \`${guild.settings.prefix}${this.help.name} ${this.help.usage}\``);
            if (guild.settings.crons.find(e => e.name.toLowerCase() === args[0].toLowerCase())) return message.channel.send(`:x: Une tâche existante porte déjà ce nom (${args[0]})`);
            let newCron = {name: args[0]};
            let temp = {}; let filter;
            let embed = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle(`Quelle est la fréquence d'apparition du message ?`)
                .setDescription(`:one: Quotidien\n:two: Hebdomadaire\n:three: Mensuel\n:four: Annuel`);
            await message.channel.send(embed)
                .then(async m => {
                    m.react(`1️⃣`);m.react(`2️⃣`);m.react(`3️⃣`);m.react(`4️⃣`);
                    filter = (reaction, user) => (reaction.emoji.name === "1️⃣" || reaction.emoji.name === "2️⃣" || reaction.emoji.name === "3️⃣" || reaction.emoji.name === "4️⃣") && user.id == message.member.id;
                    await m.awaitReactions(filter, {max: 1, time: 30000})
                        .then(collected => {
                            if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                            temp.frequency = collected.first().emoji.name.match(/1|2|3|4/)[0];
                        });
                });
            if (!temp.frequency) return;
            embed = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle(`Combien de fois par ${display[temp.frequency]} voulez-vous afficher le message ?`)
                .setDescription(`Répondez en message par un nombre entier positif non nul.`)
            message.channel.send(embed);
            filter = m => m.author.id === message.member.id;
            await message.channel.awaitMessages(filter, {max: 1, time: 30000})
                .then(collected => {
                    if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                    if (isNaN(parseInt(collected.first().content)) || parseInt(collected.first().content) < 1) return message.channel.send(`:x: Le nombre renseigné n'est pas valide !`);
                    temp.times = parseInt(collected.first().content);
                    message.channel.send(`:white_check_mark: Le message se répetera ${temp.times} fois par ${display[temp.frequency]}`);
                });
            if (!temp.times) return;
            if (temp.times > 1 && temp.frequency === "4") {
                embed = new MessageEmbed()
                    .setColor("ORANGE")
                    .setTitle(`Comment souhaitez-vous répeter ce message ?`)
                    .setDescription(`:one: Plusieurs jours pendant un même mois. \`Exemple: le 25 et le 31 décembre à 00h00\`\n:two: le même jour pendant plusieurs mois \`Exemple: le 26 avril et le 26 décembre à 00h00\``);
                await message.channel.send(embed)
                    .then(async m => {
                        m.react(`1️⃣`);m.react(`2️⃣`);
                        filter = (reaction, user) => (reaction.emoji.name === "1️⃣" || reaction.emoji.name === "2️⃣") && user.id == message.member.id;
                        await m.awaitReactions(filter, {max: 1, time: 30000})
                            .then(collected => {
                                if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                                temp.type = collected.first().emoji.name.match(/1|2/)[0];
                            });
                    });

            }
            if (temp.frequency === "4" && temp.times > 1 && !temp.type) return;
            newCron.when = undefined;
            switch (temp.frequency) {
                case `1`:
                    // Quotidien
                    // ! Nombre de répétition
                    embed = new MessageEmbed()
                        .setColor("ORANGE")
                        .setTitle(temp.times === 1 ? `Heure précise à laquelle sera répété le message` : `Minute à laquelle sera répété le message`)
                        .setDescription(temp.times === 1 ? `Le format de l'heure doit être HH:MM ou HHhMM.` : `Le message peut-être répété plusieurs fois par jour mais toujours à la même minute ! Exemple: 10h06 puis 12h06 etc.\nLe format de réponse à ce message est un nombre compris entre 00 et 59.`);
                    message.channel.send(embed)
                    filter = m => m.author.id === message.member.id;
                    await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                        .then(async collected => {
                            if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                            if (temp.times > 1) {
                                let min = collected.first().content.match(/[0-5][0-9]/)[0];
                                if (!min) return message.channel.send(`:x: Le format spécifié est invalide !`);
                                embed = new MessageEmbed()
                                    .setColor("ORANGE")
                                    .setTitle(`Heure précise à laquelle sera répété le message sans les minutes`)
                                    .setDescription(`Le format de l'heure doit être HHh.\n Veillez à séparer les différentes heures par un espace.`);
                                message.channel.send(embed)
                                await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                    .then(collectedHours => {
                                        if (collectedHours.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                                        let hours = collectedHours.first().content.match(/([01]\d|2[0-3])h/g);
                                        if (hours.length === 0 || !hours) return message.channel.send(`:x: Le format spécifié est invalide !`);
                                        if (hours.length !== temp.times) return message.channel.send(`:x: Vous avez spécifié ${hours.length} ${hours.length === 1 ? `heure valide` : `heures valides`} sur ${temp.times} attendues`);
                                        newCron.when = `${min} ${hours.join(`,`).replaceAll("h", "")} * * *`;
                                    });
                            } else {
                                let hour = collected.first().content.match(/([01]\d|2[0-3])[h:]([0-5]\d)/g);
                                if (!hour) return message.channel.send(`:x: Le format spécifié est invalide`);
                                if (hour.length > 1) return message.channel.send(`:x: Vous ne devez spécifier qu'une seule heure !`);
                                newCron.when = `${hour[0].split(/[:h]/g)[1]} ${hour[0].split(/[:h]/g)[0]} * * *`;
                            }
                        });
                    break;

                case `2`:
                    // Hebdomadaire
                    // ! Répetition de jour mais pas d'heure
                    embed = new MessageEmbed()
                        .setColor("ORANGE")
                        .setTitle(`Heure précise à laquelle sera répété le message`)
                        .setDescription(`Le format de l'heure doit être HH:MM ou HHhMM.`);
                    message.channel.send(embed)
                    filter = m => m.author.id === message.member.id;
                    await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                        .then(async collected => {
                            if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                            let hour = collected.first().content.match(/([01]\d|2[0-3])[h:]([0-5]\d)/g);
                            if (!hour) return message.channel.send(`:x: Le format spécifié est invalide`);
                            if (hour.length > 1) return message.channel.send(`:x: Vous ne devez spécifier qu'une seule heure !`);
                            embed = new MessageEmbed()
                                .setColor("ORANGE")
                                .setTitle(temp.times === 1 ? `Quel jour de la semaine ce message doit-il se répéter ?`: `Quels jours de la semaine ce message doit-il se répéter ?`)
                                .setDescription(`Réagissez avec une des réactions sachant que :one: correspond au lundi et :seven: correspond au dimanche.`);
                            await message.channel.send(embed)
                                .then(async m => {
                                    m.react(`1️⃣`);m.react(`2️⃣`);m.react(`3️⃣`);m.react(`4️⃣`);m.react(`5️⃣`);m.react(`6️⃣`);m.react(`7️⃣`);
                                    filter = (reaction, user) => (reaction.emoji.name === "1️⃣" || reaction.emoji.name === "2️⃣" || reaction.emoji.name === "3️⃣" || reaction.emoji.name === "4️⃣" || reaction.emoji.name === "5️⃣" || reaction.emoji.name === "6️⃣" || reaction.emoji.name === "7️⃣") && user.id == message.member.id;
                                    await m.awaitReactions(filter, {max: temp.times, time: 60000})
                                        .then(collected => {
                                            if (collected.size !== temp.times) return message.channel.send(`:x: Vous avez spécifié ${collected.size} ${collected.size === 1 ? `jour` : `jours`} sur ${temp.times} attendus`);
                                            let days = [];
                                            collected.forEach(e => days.push(e.emoji.name.match(/[0-7]/)[0]));
                                            newCron.when = `${hour[0].split(/[:h]/g)[1]} ${hour[0].split(/[:h]/g)[0]} * * ${days.join(`,`)}`;
                                        });
                                })
                        });
                    break;
                        //newCron.when = `${hour[0].split(/[:h]/g)[1]} ${hour[0].split(/[:h]/g)[0]} * * *`;

                case `3`:
                    // Mensuel
                    // ! Répetition de jour mais pas d'heure
                    embed = new MessageEmbed()
                        .setColor("ORANGE")
                        .setTitle(`Heure précise à laquelle sera répété le message`)
                        .setDescription(`Le format de l'heure doit être HH:MM ou HHhMM.`);
                    message.channel.send(embed);
                    filter = m => m.author.id === message.member.id;
                    await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                        .then(async collected => {
                            if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                            let hour = collected.first().content.match(/([01]\d|2[0-3])[h:]([0-5]\d)/g);
                            if (!hour) return message.channel.send(`:x: Le format spécifié est invalide`)
                            if (hour.length > 1) return message.channel.send(`:x: Vous ne devez spécifier qu'une seule heure !`);
                            embed = new MessageEmbed()
                                .setColor("ORANGE")
                                .setTitle(temp.times === 1 ? `Quel jour du mois ce message doit-il se répéter ?`: `Quels jours du mois ce message doit-il se répéter ?`)
                                .setDescription(`Envoyez un nombre compris entre 1 et 31 inclus qui sera la date à laquelle le message sera répété chaque mois.\nVeillez à séparer les jours par des espaces.`);
                            message.channel.send(embed)
                            filter = m => m.author.id === message.member.id
                            await message.channel.awaitMessages(filter, {max: 1, time: 30000})
                                .then(collected => {
                                    if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                                    let days = collected.first().content.match(/[0-2][1-9]|3[01]/g);
                                    if (days.length !== temp.times) return message.channel.send(`:x: Vous avez spécifié ${collected.size} ${collected.size === 1 ? `jour` : `jours`} sur ${temp.times} attendus`);
                                    newCron.when = `${hour[0].split(/[:h]/g)[1]} ${hour[0].split(/[:h]/g)[0]} ${days.join(`,`)} * *`;
                                })

                        });
                    break;

                case `4`:
                    // Annuel
                    // ! type de répetition
                    // ! Jours =>  Lesquels + Quel Mois
                    // ! Mois => lesquels + Quel Jour
                    if (temp.times === 1) {
                        embed = new MessageEmbed()
                            .setColor("ORANGE")
                            .setTitle(`Date et heure précise à laquelle sera répété le message`)
                            .setDescription(`Le format de la date doit être JJ/MM HH:MM ou JJ/MM HHhMM.`);
                        message.channel.send(embed);
                        filter = m => m.author.id === message.member.id;
                        await message.channel.awaitMessages(filter, {max:1, time: 60000})
                            .then(collected => {
                                if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                                let time = collected.first().content.match(/([0-2][1-9]|3[01])\/(0[1-9]|1[0-2]) ([01]\d|2[0-3])[h:]([0-5]\d)/g);
                                if (!time) return message.channel.send(`:x: Le format spécifié est invalide`)
                                if (time.length !== temp.times) return message.channel.send(`:x: Vous ne devez spécifier qu'une seule date !`);
                                time = time[0].split(/[\/h:\s]/g);
                                newCron.when = `${time[3]} ${time[2]} ${time[0]} ${time[1]} *`;
                            });
                    } else if (temp.times > 1 && temp.type === `1`) {
                        embed = new MessageEmbed()
                            .setColor("ORANGE")
                            .setTitle(`Mois précis auquel sera répété le message`)
                            .setDescription(`Le format du mois est un nombre de 01 à 12.`);
                        message.channel.send(embed);
                        filter = m => m.author.id === message.member.id;
                        await message.channel.awaitMessages(filter, {max: 1, time: 30000})
                            .then(async collected => {
                                if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                                let month = collected.first().content.match(/0[1-9]|1[0-2]/g)[0];
                                if (!month) return message.channel.send(`:x: Format de mois invalide !`);
                                embed = new MessageEmbed()
                                    .setColor("ORANGE")
                                    .setTitle(`Jours précis pendant lesquels le message sera répété le message`)
                                    .setDescription(`Le format de la date doit être un nombre compris entre 01 et 31. Veillez à séparer d'un espace chaque jour.`);
                                message.channel.send(embed);
                                filter = m => m.author.id === message.member.id
                                await message.channel.awaitMessages(filter, {max: 1, time: 30000})
                                .then(async collected => {
                                    if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                                    let days = collected.first().content.match(/[0-2][1-9]|3[01]/g);
                                    if (!days) return message.channel.send(`:x: Le format spécifié est invalide`)
                                    if (days.length !== temp.times) return message.channel.send(`:x: Vous avez spécifié ${collected.size} ${collected.size === 1 ? `jour` : `jours`} sur ${temp.times} attendus`);
                                    embed = new MessageEmbed()
                                        .setColor("ORANGE")
                                        .setTitle(`Heure précise à laquelle sera répété le message`)
                                        .setDescription(`Le format de l'heure doit être HH:MM ou HHhMM.`);
                                    message.channel.send(embed);
                                    filter = m => m.author.id === message.member.id;
                                    await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                        .then(collected => {
                                            if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                                            let hour = collected.first().content.match(/([01]\d|2[0-3])[h:]([0-5]\d)/g);
                                            if (hour.length > 1) return message.channel.send(`:x: Vous ne devez spécifier qu'une seule heure !`);
                                            newCron.when = `${hour[0].split(/[:h]/g)[1]} ${hour[0].split(/[:h]/g)[0]} ${days.join(`,`)} ${month} *`
                                        });
                                });
                            });
                    } else if (temp.times > 1 && temp.type === `2`) {
                        embed = new MessageEmbed()
                            .setColor("ORANGE")
                            .setTitle(`Jour précis auquel sera répété le message`)
                            .setDescription(`Le format du jour est un nombre de 01 à 31.`);
                        message.channel.send(embed);
                        filter = m => m.author.id === message.member.id;
                        await message.channel.awaitMessages(filter, {max: 1, time: 30000})
                            .then(async collected => {
                                if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                                let day = collected.first().content.match(/[0-2][1-9]|3[01]/g)[0];
                                if (!day) return message.channel.send(`:x: Format de jour invalide !`);
                                embed = new MessageEmbed()
                                    .setColor("ORANGE")
                                    .setTitle(`Mois précis pendant lesquels le message sera répété le message`)
                                    .setDescription(`Le format de la date doit être un nombre compris entre 00 et 31. Veillez à séparer d'un espace chaque jour.`);
                                message.channel.send(embed);
                                filter = m => m.author.id === message.member.id
                                await message.channel.awaitMessages(filter, {max: 1, time: 30000})
                                .then(async collected => {
                                    if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                                    let months = collected.first().content.match(/0[1-9]|1[0-2]/g);
                                    if (!months) return message.channel.send(`:x: Le format spécifié est invalide`)
                                    if (months.length !== temp.times) return message.channel.send(`:x: Vous avez spécifié ${collected.size} mois sur ${temp.times} attendus`);
                                    embed = new MessageEmbed()
                                        .setColor("ORANGE")
                                        .setTitle(`Heure précise à laquelle sera répété le message`)
                                        .setDescription(`Le format de l'heure doit être HH:MM ou HHhMM.`);
                                    message.channel.send(embed);
                                    filter = m => m.author.id === message.member.id;
                                    await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                        .then(collected => {
                                            if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                                            let hour = collected.first().content.match(/([01]\d|2[0-3])[h:]([0-5]\d)/g);
                                            if (!hour) return message.channel.send(`:x: Le format spécifié est invalide`)
                                            if (hour.length > 1) return message.channel.send(`:x: Vous ne devez spécifier qu'une seule heure !`);
                                            newCron.when = `${hour[0].split(/[:h]/g)[1]} ${hour[0].split(/[:h]/g)[0]} ${day} ${months.join(',')} *`
                                        });
                                });
                            });
                    }
                    break;
            }
            if (!newCron.when) return;
            if (!cron.validate(newCron.when)) return console.log(`Une erreur est survenue !`);

            embed = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle(`Quel message voulez-vous répéter ?`)
                .setDescription(`Vous pouvez inclure un fichier avec votre message.\nVous avez 2 minutes pour répondre.`);
            message.channel.send(embed);
            filter = m => m.author.id === message.member.id;
            await message.channel.awaitMessages(filter, {max: 1, time: 120000})
                .then(async collected => {
                    if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                    newCron.content = collected.first().content;
                    if (collected.first().attachments.size) {
                        const options = {
                            url: collected.first().attachments.first().url,
                            dist: "img",
                            fileName: `${guild.id}_${newCron.name}${collected.first().attachments.first().url.match(/\.png|\.jp(e)?g|\.gif/)[0]}`
                        };
                        await downloadImage(options);
                        newCron.attachment = `${guild.id}_${newCron.name}${collected.first().attachments.first().url.match(/\.png|\.jp(e)?g|\.gif/)[0]}`;
                    } else {
                        newCron.attachment = undefined;
                    }
                });
            if (!newCron.content) return;
            embed = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle(`Dans quels salons voulez vous que le message soit répété ?`)
                .setDescription(`Vous devez mentionner un ou plusieurs salons.`);
            message.channel.send(embed);
            filter = m => m.author.id === message.member.id;
            await message.channel.awaitMessages(filter, {max: 1, time: 120000})
                .then(collected => {
                    if (collected.size === 0) return message.channel.send(`:x: Création de \`${newCron.name}\` annulée`);
                    newCron.channels = collected.first().mentions.channels.map(e => e.id);
                });
            if (!newCron.channels) return;
            guild.settings.crons.push(newCron);
            await client.updateGuild(message.guild, guild);

            if (!client.tasks.has(message.guild.id)) {
                client.tasks.set(message.guild.id, new Collection());
            };

            let task = cron.schedule(newCron.when, async () => {
                let data = await client.getGuild(message.guild);
                let cron = data.settings.crons.find(e => e.name === newCron.name);
                if (!cron || cron.when !== newCron.when) return;
                if (data.settings.cronState === true) {
                    cron.channels.forEach(e => {
                        channel = client.channels.cache.get(e);
                        if (channel) {
                            if (!cron.attachment) channel.send(cron.content);
                            else channel.send(cron.content, {files: [{ attachment: `img/${cron.attachment}`, name: cron.attachment}]});
                        }
                    });
                }
            }, {
                scheduled: false
            });

            client.tasks.get(message.guild.id).set(newCron.name, task);
            if (guild.settings.cronState) client.tasks.get(message.guild.id).get(newCron.name).start();
            return message.channel.send(`:white_check_mark: Le message réccurents \`${newCron.name}\` a bien été enregistré !`);

        case "edit":
            if (!args[0]) return message.channel.send(`:x: Vous n'avez pas spécifié la tâche récurrente à supprimer !`);
            let task3 = guild.settings.crons.find(e => e.name.toLowerCase() === args[0].toLowerCase());
            if (!task3) return message.channel.send(`:x: Aucune tâche récurrente nommée \`${args[0]}\` n'a été trouvé !`);
            let embedEdit = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle(`Modification tâche récurrente \`${task3.name}\``)
                .setDescription(`:one: Modifier le message\n:two: Modifier les salons où est envoyé le message.${task3.attachment ? `\n:three: Modifier/supprimer le fichier joint au message.`: ``}`)
            let modified = false;
            await message.channel.send(embedEdit)
                .then(async m => {
                    m.react(`1️⃣`); m.react(`2️⃣`); if (task3.attachment) m.react(`3️⃣`);
                    await m.awaitReactions((reaction, user) => (reaction.emoji.name === "1️⃣" || reaction.emoji.name === "2️⃣" || reaction.emoji.name === "3️⃣") && user.id == message.member.id, {max: 1, time: 30000})
                        .then(async collected => {
                            if (collected.size < 1) return message.channel.send(`:x: Annulation de l'édition de la commande`);
                            if (collected.first().emoji.name === `1️⃣`) {
                                embedEdit.setDescription(`Veuillez indiquer le nouveau message.\nNB: Vous ne pouvez pas joindre de fichier au message.`)
                                m.channel.send(embedEdit);
                                await m.channel.awaitMessages(m => m.author.id === message.member.id, {max: 1, time: 120000})
                                    .then(async collected => {
                                        if (collected.size < 1) return message.channel.send(`:x: Annulation de l'édition de la commande`);
                                        guild.settings.crons.find(e => e.name.toLowerCase() === args[0].toLowerCase()).content = collected.first().content;
                                        await client.updateGuild(message.guild, guild);
                                        modified = true;
                                        return;
                                    });
                            } else if (collected.first().emoji.name === `2️⃣`) {
                                embedEdit.setDescription(`Veuillez indiquer les nouveaux salons.`)
                                m.channel.send(embedEdit);
                                await m.channel.awaitMessages(m => m.author.id === message.member.id, {max: 1, time: 60000})
                                    .then(async collected => {
                                        if (collected.size < 1) return message.channel.send(`:x: Annulation de l'édition de la commande`);
                                        if (!collected.first().mentions.channels.first()) return message.channel.send(`:x: Annulation ! Pas de salons spécifiés !`);
                                        guild.settings.crons.find(e => e.name.toLowerCase() === args[0].toLowerCase()).channels = collected.first().mentions.channels.map(e => e.id);
                                        await client.updateGuild(message.guild, guild);
                                        modified = true;
                                        return;
                                    });
                            } else if (collected.first().emoji.name === `3️⃣` && task3.attachment) {
                                embedEdit.setDescription(`Veuillez indiquer le nouveau fichier à inclure.`)
                                m.channel.send(embedEdit);
                                await m.channel.awaitMessages(m => m.author.id === message.member.id, {max: 1, time: 60000})
                                    .then(async collected => {
                                        if (collected.size < 1) return message.channel.send(`:x: Annulation de l'édition de la commande`);
                                        if (collected.first().attachments) {
                                            const options = {
                                                url: collected.first().attachments.first().url,
                                                dist: "img",
                                                fileName: `${guild.id}_${task3.name}${collected.first().attachments.first().url.match(/\.png|\.jp(e)?g|\.gif/)[0]}`
                                            };
                                            await downloadImage(options);
                                        } else {
                                            fs.rm(`img/${task3.attachment}`, () => {})
                                            guild.settings.crons.find(e => e.name.toLowerCase() === args[0].toLowerCase()).attachment = undefined;
                                            await client.updateGuild(message.guild, guild);
                                        };
                                        modified = true;
                                        return;
                                    });
                            };

                        });
                });
            if (!modified) return;
            return message.channel.send(`:white_check_mark: Modification de ${task3.name} enregistrée !`); 

        case "remove":
            if (!args[0]) return message.channel.send(`:x: Vous n'avez pas spécifié la tâche récurrente à supprimer !`);
            let task2 = guild.settings.crons.find(e => e.name.toLowerCase() === args[0].toLowerCase());
            if (!task2) return message.channel.send(`:x: Aucune tâche récurrente nommée \`${args[0]}\` n'a été trouvé !`);
            guild.settings.crons.splice(guild.settings.crons.indexOf(task2), 1);
            await client.updateGuild(message.guild, guild);
            if (task2.attachment) fs.rm(`img/${task2.attachment}`, () => {});
            client.tasks.get(message.guild.id).get(task2.name).destroy();
            client.tasks.get(message.guild.id).delete(task2.name);
            return message.channel.send(`:white_check_mark: La tâche récurrente \`${task2.name}\` a bien été supprimé !`);
            
        case "display":
            if (!guild.settings.crons.length) return message.channel.send(":x: Aucune tâches récurrentes n'a été créée !");
            let pages = Math.ceil(guild.settings.crons.length / 4);
            let pagesContent = [];
            let elements = guild.settings.crons;
            for (let i = 0; i < pages; i++) {
                pagesContent[i] = "";
                for (let index = 0; index < 4; index++) {
                    let e = elements.shift();
                    if (e) pagesContent[i] += `**${e.name}**\nMessage: \`\`\`${e.content}\`\`\`${e.attachment ? `Fichier: Oui` : `Fichier: Non`}\nSalons: ${e.channels.map(e => `<#${e}>`).join(`, `)}\n||Cron: ${e.when}||\n\n`;
                };                
            };
            let embedDisplay = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle(`Tâches récurrentes - Page 1/${pages}`)
                .setDescription(pagesContent[0]);
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
                        embedDisplay.setTitle(`Tâches récurrentes - Page ${actual+1}/${pages}`);
                        embedDisplay.setDescription(pagesContent[actual]);
                        m.edit(embedDisplay);
                    });
                });
            } else {
                message.channel.send(embedDisplay);
            };
            return;

        case "on":
            guild.settings.cronState = true;
            await client.updateGuild(message.guild, guild);
            let tasks = client.tasks.get(message.guild.id);
            if (tasks.size > 0) {
                tasks.forEach(task => task.start());
            };
            return message.channel.send(`:white_check_mark: Les tâches récurrentes ont bien été activés !`);

        case "off":
            guild.settings.cronState = false;
            await client.updateGuild(message.guild, guild);
            let Ctasks = client.tasks.get(message.guild.id);
            if (Ctasks.size > 0) {
                Ctasks.forEach(task => task.stop());
            };
            return message.channel.send(`:white_check_mark: Les tâches récurrentes ont bien été désactivés !`);

        default:
            let noArgsReply = new MessageEmbed()
            .setTitle(":x: Commande Invalide")
            .setDescription(`Vous n'avez pas spécifié d'arguments ! \n Utilisation de la commande :\`${guild.settings.prefix}${this.help.name} ${this.help.usage}\` \n\n Pour plus d'informations sur la commande \`${guild.settings.prefix}aide ${this.help.name}\``)
            .setColor("#f57c03");
        
            return message.channel.send(noArgsReply);
    }


};

module.exports.help = {
    name: "cron",
    aliases : ["cron"],
    category : 'paramètres',
    description: "Permet de créer des tâches récurrentes",
    cooldown: 0,
    usage: "<[add,edit,remove,display,on,off]> add,edit,remove:<name>",
    args: true,
    permission: "admin",
};