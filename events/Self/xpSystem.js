const { Collection } = require("discord.js");
const { getRndInteger } = require("../../tools/random");

module.exports = async (client, message, guild) => {
    // -> Vérification pour attribution d'xp
    if (client.experience.has(message.guild.id)){
        if (!client.experience.get(message.guild.id).has(message.member.id)) client.experience.get(message.guild.id).set(message.member.id, 0);
        if (client.experience.get(message.guild.id).get(message.member.id) >= guild.settings.experience?.maxUses) return;
    } else {
        client.experience.set(message.guild.id, new Collection().set(message.member.id, 0));
    };

    // -> Attribution d'xp
    let multiplier = guild.settings.experience?.channelMultiplier?.find(e => e.id === message.channel.id)?.value || 1;
    let gain = Math.ceil(getRndInteger(guild.settings.experience?.xpMin || 15, guild.settings.experience?.xpMax || 25) * multiplier);
    let member = message.member;
    let data = await client.getMember(member, message.guild);
    data.experience += gain;
    data.messages += 1;
    await client.updateMember(member, message.guild, data);
    client.experience.get(message.guild.id).set(message.member.id, client.experience.get(message.guild.id).get(message.member.id) + 1);
    setTimeout(() => {
        client.experience.get(message.guild.id).set(message.member.id, client.experience.get(message.guild.id).get(message.member.id) - 1);
    }, 60000);

    // -> Vérification passage level + grades
    let levelCheck = await client.levelCheck(message.member);
    if(levelCheck?.message) message.channel.send(levelCheck.message); 
};