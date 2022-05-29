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

const Suits = ['hearts','spades','clubs','diamonds']

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

class Deck {
    constructor() {
        this.cards = [];

        for(var suit of Suits){
            for(var i=0; i<13; i++) this.cards.push(new Card(suit, i+1));
        }
    }

    shuffle(){}
}

class Game {
    constructor(nick){
        this.undealt = [];
        this.decks = 0
        this.deadCards = 0;
        this.players = {};
        this.id = uuidv4();
        this.nick = nick;
    }

    addPlayer(pid) {
        this.players[pid] = PLAYERS[pid];
    }
    
    removePlayer(pid) {
        delete this.players[pid];
    }

    addDeck() {
        var deck = new Deck();
        this.undealt.push(...deck.cards);
        this.decks++;
    }
}

class Player {
    constructor(nick){
        this.cards = [];
        this.id = uuidv4();
        this.nick = nick;
        this.score = 0;
    }

    getScore() {
        var score = 0;
        for(var card of this.cards){
            score += card.value;
        }
        this.score = score;
    }
}

/**
 * GLOBAL DATA
 */
var GAMES = {};
var PLAYERS = {};

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
    
    var game = new Game(nick);
    GAMES[game.id] = game;

    res.json({
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
        result: 'success'
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
            result: 'No more players allowed in this game!'
        });
    }

    var player = new Player(nick);
    PLAYERS[player.id] = player;

    GAMES[gid].addPlayer(player.id);
    
    return res.json({
        result: 'success'
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
    
    delete PLAYERS[pid];
    
    res.json({
        result: 'success'
    });
});

/**
 * DEAL CARDS
 */
app.get('/api/add/player_cards', (req, res) => {
    var gid = req.query.gid;
    var pid = req.query.pid;
    var qt = req.query.qt;

    if(qt > GAMES[gid].undealt.length) qt = GAMES[gid].undealt.length;
    
    for (let i = 0; i < qt; i++) {
        var top = GAMES[gid].undealt.pop();
        GAMES[gid].players[pid].cards.push(top);       
    }
    GAMES[gid].players[pid].getScore();
    
    res.json({
        result: 'success'
    });
});

/**
 * ADD A DECK
 */
app.get('/api/add/deck', (req, res) => {
    var gid = req.query.gid;
    
    GAMES[gid].addDeck();
    
    res.json({
        result: 'success'
    });
});

app.get('/', (req, res) => {
    console.log(GAMES);
    res.render('index', {GAMES});
});

app.listen('3333', () => {
    console.log('HTTP Server running on port 3333');
})