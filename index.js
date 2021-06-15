// ##################################################################### //
// ########################## Auteur : DioFun ########################## //
// ######################### 31/12/2020  17:14 ######################### //
// ##################################################################### //

// * Requirements
const { Client, Collection } = require('discord.js');
const { loadConfig, loadCommands, loadEvents, loadCrons } = require("./tools/loader.js")

const client = new Client();
require("./tools/database")(client);
["commands", "cooldowns", "tasks"].forEach(x => client[x] = new Collection());
// * End of Requirements

// * Bot Starting
loadConfig(client);
loadCommands(client);
loadEvents(client);
loadCrons(client);

client.login(client.config.TOKEN);