module.exports.run = async (client, message, args, guild) => {     
    if (message.author.id !== "287559092724301824") return;
    guild.settings.experience = new Experience();
    guild.members.forEach(e => {
        e.level = 0;
        e.messages = 0;
    });
    await client.updateGuild(message.member.guild, guild);
};

module.exports.help = {
    name: "updatebdd",
    aliases : ["updatebdd"],
    category : 'developpement',
    description: "/",
    cooldown: 0,
    usage: "",
    args: false,
    permission: "développeur",
};

class Experience {
    constructor() {
        this.xpMin = 15;
        this.xpMax = 25;
        this.maxUses = 1;
        this.levelUpMessage = "Bravo à {user} qui passe au niveau {level}";
        this.channelMultiplier = [];
        this.ranks = [];
    };
};