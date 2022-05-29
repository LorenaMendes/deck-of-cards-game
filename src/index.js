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
        this.deck = [];
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
}

class Player {
    constructor(nick){
        this.cards = null;
        this.id = uuidv4();
        this.nick = nick;
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
 * ADD A PLAYER
 */
app.get('/api/add/player', (req, res) => {
    var gid = req.query.gid;
    var nick = req.query.nick;
    
    if(Object.keys(PLAYERS).length >= 4){
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
    
    GAMES[gid].removePlayer(pid);
    
    delete PLAYERS[pid];
    
    res.json({
        result: 'success'
    });
});

/**
 * ADD A DECK
 */
app.get('/api/add/deck', (req, res) => {
    var gid = req.query.gid;
    
    var deck = new Deck();
    GAMES[gid].deck.push(...deck.cards);
    
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