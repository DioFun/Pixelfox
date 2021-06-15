module.exports = (client) => {

    client.guilds.cache.forEach(async guild => {
        
        let channel = guild.channels.cache.find(e => e.name.toLowerCase() === "général" && e.type === "text");
        if (channel) {
            let guildData = await client.getGuild(guild);
            channel.send(`N'hésitez pas à utiliser la commande \`${guildData.settings.prefix}help\` afin d'avoir des infos et des tutos sur les fonctionnalités du serveur !`);
        }

    });

} 

module.exports.when = "36 19 * * *";