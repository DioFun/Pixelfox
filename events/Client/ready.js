const { Collection } = require("discord.js");
const { Manager } = require("erela.js");
const cron = require(`node-cron`);

module.exports = async client => {
    console.log(`Connected as ${client.user.tag}`);
    client.user.setActivity(`${client.settings.status}`);

    /*
    // -> Radio Initialisation
    client.manager = new Manager({
        nodes: [
            {
                host: client.config.LAVALINK_HOST,
                port: client.config.LAVALINK_PORT,
                password: client.config.LAVALINK_PASSWORD
            }
        ],
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
    })
        .on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`))
        .on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))
        .on("trackStart", (player, track) => {
          client.channels.cache
            .get(player.textChannel)
            .send(`Now playing: ${track.title}`);
        })
        .on("queueEnd", (player) => {
          client.channels.cache
            .get(player.textChannel)
            .send("Queue has ended.");

          player.destroy();
        });

    //client.manager.init(client.user.id);
    client.on("raw", (d) => client.manager.updateVoiceState(d));
    */

    // -> Init mangoose
    await client.mongoose.init();

    // -> Update Bdd, Mute Check && Cron load
    client.guilds.cache.forEach(async (guild) => {
        let guildData = await client.getGuild(guild)
        if (!guildData) {
            await client.createGuild(guild);
            guildData = await client.getGuild(guild);
        }
        let members = await guild.members.fetch();
        members.forEach(async (member) => {
            if (!member.user.bot){
                let data = await client.getMember(member, guild)
                if(!data) {                    
                    await client.createMember(member, guild);
                } else if (data.infractions.find(inf => inf.isActive && inf.type === "mute")) {
                    
                    let remainTime = data.infractions.find(inf => inf.isActive && inf.type === "mute").end - Date.now();
                    
                    if (remainTime <= 0) {
                        data.infractions.find(inf => inf.isActive && inf.type === "mute").isActive = false;
                        await client.updateMember(member, guild, data);
                        member.roles.remove(guild.roles.cache.get(guildData.settings.muteRoleID));
                    } else {
                        setTimeout(async () => {
                            data.infractions.find(inf => inf.isActive && inf.type === "mute").isActive = false;
                            await client.updateMember(member, guild, data);
                            member.roles.remove(guild.roles.cache.get(guildData.settings.muteRoleID));
                        }, remainTime);
                    }
                }
            } 
        });
        if (guildData.settings.crons.length > 0) {
            if (!client.tasks.get(guild.id)) {
                client.tasks.set(guild.id, new Collection());
            }
            guildData.settings.crons.forEach(elem => {
                let task = cron.schedule(elem.when, async () => {
                    let data = await client.getGuild(guild);
                    let cronTask = data.settings.crons.find(e => e.name === elem.name);
                    if (!cronTask || elem.when !== cronTask.when) return;
                    if (data.settings.cronState === true) {
                        cronTask.channels.forEach(e => {
                            channel = client.channels.cache.get(e);
                            if (channel) {
                                if (!cronTask.attachment) channel.send(cronTask.content);
                                else channel.send(cronTask.content, {files: [{ attachment: `img/${cronTask.attachment}`, name: cronTask.attachment}]});
                            }
                        });
                    }
                }, {
                    scheduled: false
                });

                client.tasks.get(guild.id).set(elem.name, task);
                if (guildData.settings.cronState) client.tasks.get(guild.id).get(elem.name).start();
            });
        }
    });

    // -> Slash Commands
    let slashCommands = require("../../slash_commands/settings");
    client.guilds.cache.forEach(async guild => {
        let commands = await guild.commands.fetch();
        commands.forEach(command => {
            if (!slashCommands.find(e => e.name === command.name)) guild.commands.delete(command.id);
        });
        for (let i = 0; i < slashCommands.length; i++) {
            const slashCommand = slashCommands[i];
            let command = commands.find(e => e.name === slashCommand.name)
            if (command) command.edit(slashCommand);
            else {
                let newCommand = await guild.commands.create(slashCommand);
                if (!slashCommand.defaultPermission) newCommand.permissions.add({
                    permissions: [{
                        id: guild.ownerId,
                        type: "USER",
                        permission: true
                    }]
                });
            };            
        };
    });

};