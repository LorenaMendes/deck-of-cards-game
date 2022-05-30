const {v4:uuidv4} = require("uuid");
var Deck = require(__dirname + '/Deck.js');
var Player = require(__dirname + '/Player.js');
var Card = require(__dirname + '/Card.js');

class Game {
    constructor(nick){
        this.undealt = [];
        this.decks = 0;
        this.cHearts = 0;
        this.cSpades = 0;
        this.cClubs = 0;
        this.cDiamonds = 0;
        this.deadCards = 0;
        this.players = {};
        this.id = uuidv4();
        this.nick = nick;
    }

    addPlayer(player) {
        this.players[player.id] = player;
    }
    
    removePlayer(pid) {
        delete this.players[pid];
    }

    addDeck() {
        var deck = new Deck();
        this.undealt.push(...deck.cards);
        this.decks++;
        this.cHearts += 13;
        this.cSpades += 13;
        this.cClubs += 13;
        this.cDiamonds += 13;
    }

    dealCards(pid, qt) {
        for (let i = 0; i < qt; i++) {
            var top = this.undealt.pop();
            switch (top.suit) {
                case 'hearts':
                    this.cHearts--;
                    break;
                case 'spades':
                    this.cSpades--;
                    break;
                case 'clubs':
                    this.cClubs--;
                    break;
                case 'diamonds':
                    this.cDiamonds--;
                    break;
            }
            this.players[pid].cards.push(top);       
            this.players[pid].score += top.value;       
        }
    }

    shuffleDeck() {
        let len = this.undealt.length;
        for (let i = 0; i < len; i++) {
            let rand = Math.floor(Math.random() * len);
            let temp = this.undealt[i];
            this.undealt[i] = this.undealt[rand];
            this.undealt[rand] = temp;
        }
    }

    countSuitValue() {
        let count = {
            'hearts': {'A':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'J':0,'Q':0,'K':0},
            'spades': {'A':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'J':0,'Q':0,'K':0},
            'clubs': {'A':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'J':0,'Q':0,'K':0},
            'diamonds': {'A':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'J':0,'Q':0,'K':0}
        };

        for (var card of this.undealt) {
            count[card.suit][card.face]++; 
        }
        return count;
    }
}

module.exports = Game;