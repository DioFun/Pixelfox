exports.DatabaseMember = class {
    constructor(userid, username) {
        this.userID = userid;
        this.username = username;
        this.birthdate = "";
        this.infractions = [];
        this.experience = 0;
        this.messages = 0;
        this.level = 0;
    };
}