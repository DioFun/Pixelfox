const { loadFile } = require('./file.js')
const { readdirSync } = require('graceful-fs');
const cron = require('node-cron');




// * Configuration Handler
const loadConfig = (client, dir = "./settings/") => {
    console.log("Loading configuration files...");
    readdirSync(dir).forEach(file =>{
        if (file.split(".")[1] === "json"){
            client[file.split(".")[0]] = loadFile(file);
            console.log(` - ${file} loaded`);
        } else if (file.split(".")[1] === "js"){
            client[file.split(".")[0]] = require(`../settings/${file}`);
            console.log(` - ${file} loaded`);
        };
    });
    console.log("Configuration files loaded");
};
// * End of Configuration Handler




// * Event Handler

const loadEvents = (client, dir = "./events/") => {
    console.log("Loading events...");
    readdirSync(dir).filter(e => !e.startsWith("-")).forEach(dirs => {
        const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js') && !files.startsWith("-"));

        for (const event of events) {
            const evt = require(`../${dir}/${dirs}/${event}`);
            const evtName = event.split(".")[0];
            client.on(evtName, evt.bind(null, client));
            console.log(` - ${evtName} loaded`);
        };
    });
    console.log("Events loaded");
};

//* End of Event Handler




// * Command Handler

const loadCommands = (client, dir = "./commands/") => {
    console.log("Loading commands...");
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js') && !files.startsWith("-"));

        for (const file of commands) {
            const getFileName = require(`../${dir}/${dirs}/${file}`);
            client.commands.set(getFileName.help.name, getFileName);
            console.log(` - ${getFileName.help.name} loaded`);
        };
    });
    console.log("Commands loaded");
};

// * End of Command Handler




// * Slash Command Handler

const loadSlashCommands = (client, dir = "./slash_commands/") => {
    console.log("Loading slash commands...");
    readdirSync(dir).filter(e => !e.endsWith(".js")).forEach(dirs => {
        const slash_commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js") && !files.startsWith("-"));
        for (const file of slash_commands) {
            const getFileName = require(`../${dir}/${dirs}/${file}`);
            client.slashCommands.set(getFileName.settings.name, getFileName);
            console.log(` - ${getFileName.settings.name} loaded`);
        };
    });
    console.log(`Slash Commands loaded`);
};

// * End of Slash Command Handler




// * Cron Handler

const loadCrons = (client, dir = "./cron-tasks/") => {
    console.log("Loading cron tasks ...")
    readdirSync(dir).forEach(file => {
        if (file.split(".")[1] === "js" && !file.startsWith("-")){
            const task = require(`../cron-tasks/${file}`)
            cron.schedule(task.when, task.bind(null, client));
            console.log(` - ${file} loaded`);
        };
    });
    console.log("Cron tasks loaded")
}

// * End of Cron Handler




module.exports = {
    loadCommands,
    loadSlashCommands,
    loadConfig,
    loadEvents,
    loadCrons
}