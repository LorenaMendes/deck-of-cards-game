const {v4:uuidv4} = require("uuid");

class Player {
    constructor(nick){
        this.cards = [];
        this.id = uuidv4();
        this.nick = nick;
        this.score = 0;
    }
}

module.exports = Player;