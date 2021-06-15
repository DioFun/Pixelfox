const mongoose = require("mongoose");

const permissionsSchema = mongoose.Schema({
    admin: {
        "type": Array,
        "default": []
    },
    moderator: {
        "type": Array,
        "default": []
    },
    staff :{
        "type": Array,
        "default": []
    },
    member: {
        "type": Array,
        "default": []
    }
});

const settingSchema = mongoose.Schema({
    prefix: {"type": String, "default": "!"},
    logChannel: {"type": String, "default": ""},
    birthdayChannel: {"type": String, "default": ""},
    welcomeChannel: {"type": String, "default": ""},
    muteRoleID: {"type": String, "default": ""},
    permissions: {"type": permissionsSchema, "default": {}},
    cooldown: {"type": Number, "default": 5},
    welcomeMessages: {"type": Array, "default": ["Hey ! Bienvenue <user> !"]},
    birthdayMessage: {"type": String, "default": ""},
    cronState: {"type": Boolean, "default": false},
    crons: {"type": Array, "default": []}
});

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    settings: {"type": settingSchema, "default": {}},
    members: {"type": Array, "default": []}
});

module.exports = mongoose.model("Guild", guildSchema);