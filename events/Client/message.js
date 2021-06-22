const { Collection, MessageEmbed } = require('discord.js');
const { hasPermission } = require('../../tools/permissions.js');

module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type == "dm") return;

    // -> Temporaire (à supprimer)
    if (message.channel.id === "822982534664290324") {
        if (hasPermission(client, message.member, "staff")) return;
        message.delete();
        if (!client.event) {
            client.event = [];
        }
        if (client.event.find(e => e === message.author.id)) return;
        message.guild.channels.cache.get("808067235289104447").send(`${message.author.tag} -> ${message.content}`).then(message => {
            message.react(":zero:");
            message.react(":one:");
            message.react(":two:");
        });
        client.event.push(message.author.id)
    }

    let guild = await client.getGuild(message.guild);


    if (!message.content.toLowerCase().startsWith(guild.settings.prefix)) return;
    if (!hasPermission(client, message.member, "member")) return message.channel.send(':x: Vous devez accepter le réglement avant de pouvoir utiliser les commandes !');
    const args = message.content.slice(guild.settings.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
    if (!command) return;

    // -> Permissions checking
    if (command.help.permission) {
        if (!hasPermission(client, message.member, command.help.permission)) return message.channel.send(":x: Vous n'avez pas la permission d'effectuer cette commande !");
    };

    // -> Arguments checking
    if (command.help.args && !args.length) {
        let noArgsReply = new MessageEmbed()
            .setTitle(":x: Commande Invalide")
            .setDescription(`Vous n'avez pas spécifié d'arguments ! \n Utilisation de la commande :\`${guild.settings.prefix}${commandName} ${command.help.usage}\` \n\n Pour plus d'informations sur la commande \`${guild.settings.prefix}aide ${command.help.name}\``)
            .setColor("#f57c03");
        
        return message.channel.send(noArgsReply);
    };

    // -> Coooldowns checking
    if ((guild.settings.cooldown || command.help.cooldown) && !hasPermission(client, message.member, "staff")){
        if (!client.cooldowns.has(command.help.name)) {
            client.cooldowns.set(command.help.name, new Collection());
        };

        const timeNow = Date.now();
        const tStamps = client.cooldowns.get(command.help.name);
        const cdAmount = (command.help.cooldown || guild.settings.cooldown) * 1000;

        if (tStamps.has(message.author.id)) {
            const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

            if (timeNow < cdExpirationTime){
                timeLeft = (cdExpirationTime - timeNow) / 1000;
                return message.channel.send(`:x: Vous devez encore attendre ${timeLeft.toFixed(0)} seconde(s) avant de pouvoir effectuer cette commande à nouveau !`);
            };
        };

        tStamps.set(message.author.id, timeNow);
        setTimeout(() => tStamps.delete(message.author.id), cdAmount);
    };
    
    // -> Command execution
    command.run(client, message, args, guild);
};



/*
const members = [{name: "diofun", level: 15, xp: 3560},{name: "morgane", level: 10, xp: 7800},{name: "kayzen", level: 30, xp: 38451},{name: "skyrise", level: 30, xp: 38451}];
members.sort((a, b) => {
	if (b.level !== a.level) {
      	return b.level - a.level
    } else {
    	return b.xp - a.xp
    }
});
console.log(members);
console.log(members.map(e => e.name));
*/