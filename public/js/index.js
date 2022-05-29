async function loadGames() {
    
    let response = await fetch('/api/get/games');
    var games = await response.json();
    games = games['games'];

    document.getElementById('gameNick').value = '';
    
    var ul_content = '';
    for (let g of Object.keys(games)) {
        var cur_game = games[g];
        
        ul_content += ` <div class="text-and-icons">
                            <li><a onclick="loadGame('${cur_game.id}')">
                            ${cur_game.nick}
                            </a></li>
                            <a title="Remove game" onclick="removeGame('${cur_game.id}')">
                            <i class="fa fa-ban icon"></i>
                            </a>
                        </div>`
    }

    var html = `
        <ul>
            ${ul_content}
        </ul>
    `;

    document.getElementById('games-list').innerHTML = html;
}

async function loadGame(gid) {

    let response = await fetch(`/api/get/game?gid=${gid}`);
    var game = await response.json();
    game = game['game'];
    
    var players = '';
    for (let p of Object.keys(game.players)) {
        var player = game.players[p];
        players += `<div class="text-and-icons"><li>${player.nick}</li> <a title="Kick player" onclick="removePlayer('${gid}', '${p}')"><i class="fa fa-ban icon"></i></a></div>`
    }

    var html = `<div class="game-data-title">Game: ${game.nick}</div>
                <br><br>
                <div class="text-and-icons">
                    <span>DECK INFO</span>
                    <a title="Shuffle deck"><i class="fa fa-random icon"></i></a>
                    <a title="Add deck" onclick="addDeck('${gid}')"><i class="fa fa-plus icon"></i></a>
                </div>
                <div class="deck-info">
                    <span>Total: ${game.deck.length} cards</span>
                    <ul>
                        <li>24 hearts</li>
                        <li>26 spades</li>
                        <li>25 clubs</li>
                        <li>21 diamonds</li>
                    </ul>
                </div>
                
                <div>
                        <span>PLAYERS INFO</span><br>
                    </div>
                    <div class="deck-info">
                        <ul>
                            ${players}
                        </ul>
                    </div>
                    
                    <div class="add-player">
                        <input id="playerNick" type="text" class="form-control input-add" placeholder="new player"/>
                        <a title="Add player" onclick="addPlayer('${gid}')"><i class="fa fa-plus icon"></i></a>
                    </div>
                `

    document.getElementById('game-data').innerHTML = html;
}

async function addGame(nick) {
    console.log('ADD GAME');

    var nick = document.getElementById('gameNick').value;
    if(nick == '' || nick == undefined) nick = 'no name';

    let response = await fetch(`/api/new/game?nick=${nick}`);
    var result = await response.json();
    console.log(result);

    loadGames();
}

async function removeGame(gid) {
    console.log('REMOVE GAME');

    let response = await fetch(`/api/remove/game?gid=${gid}`);
    var result = await response.json();
    console.log(result);

    document.getElementById('game-data').innerHTML = '';

    loadGames();
}

async function addDeck(gid) {
    console.log('ADD DECK');

    let response = await fetch(`/api/add/deck?gid=${gid}`);
    var result = await response.json();
    console.log(result);

    loadGame(gid);
}

async function addPlayer(gid) {
    console.log('ADD PLAYER');

    var nick = document.getElementById('playerNick').value;
    if(nick == '' || nick == undefined) nick = 'no name';

    let response = await fetch(`/api/add/player?gid=${gid}&nick=${nick}`);
    var result = await response.json();
    if(result.result != 'success') alert(result.result);

    loadGame(gid);
}

async function removePlayer(gid, pid) {
    console.log('REMOVE PLAYER');

    let response = await fetch(`/api/remove/player?gid=${gid}&pid=${pid}`);
    var result = await response.json();
    console.log(result);

    loadGame(gid);
}