const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuidv4 = require("uuid/v4")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/public', express.static('./public/')); // Use custom JS and CSS files

/**
 * CLASSES
 */

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        switch (value) {
            case 1:
                this.face = 'A'
                break;
            case 11:
                this.face = 'J'
                break;
            case 12:
                this.face = 'Q'
                break;
            case 13:
                this.face = 'K'
                break;
            default:
                this.face = value.toString();
                break;
        }
    }
}

const Suits = ['hearts','spades','clubs','diamonds'];

class Deck {
    constructor() {
        this.cards = [];

        for(var suit of Suits){
            for(var i=0; i<13; i++) this.cards.push(new Card(suit, i+1));
        }
    }
}

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

class Player {
    constructor(nick){
        this.cards = [];
        this.id = uuidv4();
        this.nick = nick;
        this.score = 0;
    }
}

/**
 * GLOBAL DATA
 */
var GAMES = {};

/**
 * GET GAMES
 */
app.get('/api/get/games', (req, res) => {
    res.json({
        games: GAMES, 
    });
});

/**
 * GET A GAME
 */
app.get('/api/get/game', (req, res) => {
    var gid = req.query.gid;

    res.json({
        game: GAMES[gid],
    });
});

/**
 * CREATE A GAME
 */
app.get('/api/new/game', (req, res) => {
    var nick = req.query.nick;
    
    if(Object.keys(GAMES).length >= 25){
        return res.json({
            message: 'Limit of 25 games reached!',
        });
    }

    var game = new Game(nick);
    GAMES[game.id] = game;

    res.json({
        message: 'success',
        game: game,
    });
});

/**
 * REMOVE A GAME
 */
app.get('/api/remove/game', (req, res) => {
    var gid = req.query.gid;
    
    delete GAMES[gid];

    res.json({
        message: 'success'
    });
});

/**
 * GET PLAYERS
 */
app.get('/api/get/players', (req, res) => {
    var gid = req.query.gid;
    
    return res.json({
        players: GAMES[gid].players
    });
});

/**
 * GET A PLAYER
 */
app.get('/api/get/player', (req, res) => {
    var gid = req.query.gid;
    var pid = req.query.pid;
    
    return res.json({
        player: GAMES[gid].players[pid]
    });
});

/**
 * ADD A PLAYER
 */
app.get('/api/add/player', (req, res) => {
    var gid = req.query.gid;
    var nick = req.query.nick;
    
    if(Object.keys(GAMES[gid].players).length >= 4){
        return res.json({
            message: 'No more players allowed in this game!'
        });
    }

    var player = new Player(nick);

    GAMES[gid].addPlayer(player);
    
    return res.json({
        message: 'success'
    });
});

/**
 * REMOVE A PLAYER
 */
app.get('/api/remove/player', (req, res) => {
    var gid = req.query.gid;
    var pid = req.query.pid;
    
    GAMES[gid].deadCards += GAMES[gid].players[pid].cards.length;

    GAMES[gid].removePlayer(pid);
    
    res.json({
        message: 'success'
    });
});

/**
 * DEAL CARDS
 */
app.get('/api/add/player_cards', (req, res) => {
    var gid = req.query.gid;
    var pid = req.query.pid;
    var qt = req.query.qt;

    if(GAMES[gid].undealt.length == 0){
        return res.json({
            message: 'No cards on the deck!'
        });
    }

    if(qt > GAMES[gid].undealt.length) qt = GAMES[gid].undealt.length;

    GAMES[gid].dealCards(pid, qt);

    res.json({
        message: 'success'
    });
});

/**
 * ADD A DECK
 */
app.get('/api/add/deck', (req, res) => {
    var gid = req.query.gid;
    
    if(GAMES[gid].decks >= 10){
        return res.json({
            message: 'Maximum of 10 decks reached for this game!'
        });
    }
    GAMES[gid].addDeck();
    
    res.json({
        message: 'success'
    });
});

/**
 * ADD A DECK
 */
app.get('/api/shuffle/deck', (req, res) => {
    var gid = req.query.gid;

    if(GAMES[gid].undealt.length == 0){
        return res.json({
            message: 'No cards to shuffle!'
        });
    }
    
    GAMES[gid].shuffleDeck();
    
    res.json({
        message: 'Deck shuffled!'
    });
});

/**
 * GET DECK DETAILS
 */
app.get('/api/detail/deck', (req, res) => {
    var gid = req.query.gid;
    
    let count = GAMES[gid].countSuitValue();
    console.log(JSON.stringify(count))
    
    res.json({
        count: count
    });
});

app.get('/', (req, res) => {
    res.render('index', {GAMES});
});

app.listen('3333', () => {
    console.log('HTTP Server running on port 3333');
})