module.exports.run = async (client, message, args) => {
    function clean(text) {
        if (typeof text === "string") 
          return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        return text;
    }
     
    if (message.author.id !== "287559092724301824") return;
    const code = args.join(" ");
    const evaled = eval(code);
    const cleanCode = await clean(evaled);
    message.channel.send(cleanCode, { code: "js" });
};

module.exports.help = {
    name: "eval",
    aliases : ["eval"],
    category : 'developpement',
    description: "/",
    cooldown: 0,
    usage: "<js_code>",
    args: true,
    permission: "développeur",
}