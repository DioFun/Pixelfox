const mongoose = require("mongoose");
const { Guild } = require("../models/index.js");

module.exports = client => {

    // -> Guilds' Functions

    client.createGuild = async guild => {
        const merged = {
            _id: mongoose.Types.ObjectId(),
            guildID: guild.id,
        };
        const createGuild = await new Guild(merged);
        createGuild.save();
    };

    client.getGuild = async guild => {
        if (!guild.id) return false;
        const data = await Guild.findOne({ guildID: guild.id });
        if (data) return data;
        return false;
    };

    client.updateGuild = async (guild, settings) => {
        let data = await client.getGuild(guild);
        if (typeof data !== "object") data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
        };
        return data.updateOne(settings);
    };

    // -> Members' Functions

    client.createMember = async (member, guild) => {
        const newMember = new Member(member.id, member.user.username);

        await Guild.updateOne(
            {guildID: guild.id},
            {$push : { members: newMember}}
        );
    };

    client.getMember = async (member, guild) => {
        if (!member.id) member.id = member.userID;
        let data = await client.getGuild(guild);
        let memberData = data.members.find(e => e.userID === member.id);
        if (memberData) return memberData;
        return false;
    };

    client.getMemberByUsername = async (username, guild) => {
        let data = await client.getGuild(guild);
        let memberData = data.members.find(e => e.username.toLowerCase() === username.toLowerCase());
        if (memberData) return memberData;
        return false;
    };

    client.updateMember = async (member, guild, settings) => {
        let data = await client.getMember(member, guild);
        if (typeof data !== "object") data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
        };
        let guildData = await client.getGuild(guild);
        let position = guildData.members.map(e => e.userID).indexOf(member.id);
        guildData.members[position] = data;
        await client.updateGuild(guild, guildData);
        return guildData;
    };

    // -> Infractions' Functions

    client.addInfraction = async (member, guild, type, reason, date = Date.now(), isActive = true, end = new Date().setTime(0)) => {
        const infraction = {
            type: type,
            reason: reason,
            date: date,
            isActive: isActive,
            end: end
        };
        let data = await client.getMember(member, guild);
        data.infractions.push(infraction);
        await client.updateMember(member, guild, data).then(e => {return e;});
    };
};


class Member {
    constructor(userid, username) {
        this.userID = userid;
        this.username = username;
        this.birthdate = "";
        this.infractions = [];
        this.experience = 0;
        this.messages = 0;
        this.level = 0;
    };
};