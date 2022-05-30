const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var Game = require(__dirname + '/classes/Game.js');
var Player = require(__dirname + '/classes/Player.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/public', express.static('./public/')); // Use custom JS and CSS files

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
    
    res.json({
        count: count
    });
});

app.get('/', (req, res) => {
    res.render('client', {GAMES});
});

app.listen('3333', () => {
    console.log('HTTP Server running on port 3333');
})