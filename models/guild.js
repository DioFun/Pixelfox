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

const experienceSchema = mongoose.Schema({
    xpMin: {"type": Number, "default": 15},
    xpMax: {"type": Number, "default": 25},
    maxUses: {"type": Number, "default": 1},
    levelUpMessage: {"type": String, "default": "Bravo à {user} qui passe au niveau {level}"},
    channelMultiplier: {"type": Array, "default": []},
    ranks: {"type": Array, "default": []},
    
})

const settingSchema = mongoose.Schema({
    prefix: {"type": String, "default": "!"},
    logChannel: {"type": String, "default": ""},
    birthdayChannel: {"type": String, "default": ""},
    welcomeChannel: {"type": String, "default": ""},
    supportChannel: {"type": String, "default": ""},
    muteRoleID: {"type": String, "default": ""},
    staffRoleID: {"type": String, "default": ""},
    permissions: {"type": permissionsSchema, "default": {}},
    cooldown: {"type": Number, "default": 5},
    welcomeMessages: {"type": Array, "default": ["Hey ! Bienvenue {user} !"]},
    birthdayMessage: {"type": String, "default": ""},
    cronState: {"type": Boolean, "default": false},
    crons: {"type": Array, "default": []},
    experience: {"type": experienceSchema, "default": {}},
    latestMessageDeleted: {"type": Object, "default": {}}
});

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    settings: {"type": settingSchema, "default": {}},
    members: {"type": Array, "default": []}
});

module.exports = mongoose.model("Guild", guildSchema);