module.exports.run = async (client, message, args) => {
    console.log(`2️⃣`.match(/1|2|3|4/)[0])
};

module.exports.help = {
    name: "test",
    aliases : ["test"],
    category : 'developpement',
    description: "",
    cooldown: 0,
    usage: "",
    args: false,
    permission: "développeur",
}