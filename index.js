// ##################################################################### //
// ########################## Auteur : DioFun ########################## //
// ######################### 31/12/2020  17:14 ######################### //
// ##################################################################### //

// * Requirements
const { Client, Collection, Intents } = require('discord.js');
const { loadConfig, loadCommands, loadEvents, loadCrons, loadSlashCommands } = require("./tools/loader.js")

const clientIntents = new Intents();
clientIntents.add("GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "GUILD_INTEGRATIONS");

const client = new Client({intents: clientIntents});
require("./tools/database")(client);
require("./tools/xpSystem")(client);
["commands", "cooldowns", "tasks", "experience", "slashCommands"].forEach(x => client[x] = new Collection());
// * End of Requirements

// * Bot Starting
loadConfig(client);
loadCommands(client);
loadSlashCommands(client);
loadEvents(client);
loadCrons(client);

client.login(client.config.TOKEN);