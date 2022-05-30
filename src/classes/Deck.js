var Card = require(__dirname + '/Card.js');

const Suits = ['hearts','spades','clubs','diamonds'];

class Deck {
    constructor() {
        this.cards = [];

        for(var suit of Suits){
            for(var i=0; i<13; i++) this.cards.push(new Card(suit, i+1));
        }
    }
}

module.exports = Deck;