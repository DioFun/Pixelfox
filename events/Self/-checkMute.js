const { TStoShortDate } = require("../../tools/date");

module.exports = async (client, message) => {
            
    let data = await client.getMember(message.member);
    if (!data) return;

    let mute = data.infractions.find(e => e.isActive && e.type === "mute");
    if(!mute) return;
    if (mute.end > Date.now()) {
        if (message.deletable) message.delete();
        return message.member.send(`:x: Vous êtes réduit au silence sur ${message.guild.name} ! ${mute.end ? `Expire le ${TStoShortDate(mute.end)}` : ``}`);
    } else {
        data.infractions.find(inf => inf.isActive && inf.type === "mute").isActive = false;
        await client.updateMember(message.member, data);
    }

}
