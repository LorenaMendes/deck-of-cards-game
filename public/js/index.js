async function loadGames() {
    
    let response = await fetch('/api/get/games');
    var games = await response.json();
    games = games['games'];

    document.getElementById('gameNick').value = '';
    
    var ul_content = '';
    for (let g of Object.keys(games)) {
        var cur_game = games[g];
        
        ul_content += `
            <div class="text-and-icons">
                <li class="clickable-text"><a onclick="loadGame('${cur_game.id}')">
                ${cur_game.nick}
                </a></li>
                <a title="Remove game" onclick="removeGame('${cur_game.id}')">
                <i class="fa fa-ban icon"></i>
                </a>
            </div>
        `
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
        players += `
            <div class="text-and-icons">
                <a onclick="loadPlayerDetails('${gid}', '${p}')">
                    <li class="clickable-text">${player.nick}  -  ${player.score} points</li>
                </a>
                <a title="Kick player" onclick="removePlayer('${gid}', '${p}')">
                    <i class="fa fa-ban icon"></i>
                </a>
            </div>
        `
    }

    var html = `
        <div class="game-data-title">Game: ${game.nick}</div>
        <br><br>
        <div class="text-and-icons">
            <span>DECK INFO</span>
            <a title="Shuffle deck"><i class="fa fa-random icon"></i></a>
            <a title="Add deck" onclick="addDeck('${gid}')"><i class="fa fa-plus icon"></i></a>
        </div>
        <div class="deck-info">
            <span>Decks in this game: ${game.decks} (${game.decks * 52} cards)</span>
            <span>Undealt cards: ${game.undealt.length} cards</span>
            <span>Dead cards: ${game.deadCards} cards</span>
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
        <div class="add-player">
            <input id="playerNick" type="text" class="form-control input-add" placeholder="new player"/>
            <a title="Add player" onclick="addPlayer('${gid}')"><i class="fa fa-plus icon"></i></a>
        </div>
        <div class="deck-info">
            <ul>
                ${players}
            </ul>
        </div>
        
    `

    document.getElementById('game-data').innerHTML = html;
}

async function loadPlayerDetails(gid, pid) {

    let response = await fetch(`/api/get/player?gid=${gid}&pid=${pid}`);
    var player = await response.json();
    
    player = player['player'];

    var player_cards = '';
    for (var card of player.cards) {
        let symbol, color;
        switch (card.suit) {
            case 'hearts':
                symbol = '♥';
                color = 'red';
                break;
            case 'clubs':
                symbol = '♣';
                color = 'black';
                break;
            case 'diamonds':
                symbol = '♦';
                color = 'red';
                break;
            case 'spades':
                symbol = '♠';
                color = 'black';
                break;
        }
        
        player_cards += `
            <div class="card ${color}-card">
                <div class="card-face">${card.face}</div>
                <div class="card-symbol">
                    ${symbol}
                </div>
            </div>
        `;
    }

    var html = `
        <div class="game-data-title">Player: ${player.nick} - ${player.score} points</div>
        <br><br>
        <div class="text-and-icons">
        </div>
        <div class="player-cards-container">
            ${player_cards}
        </div>
        <div class="deal-cards-menu">
            <input id="numberOfCards" type="number" class="form-control input-add" value="1" min="1" placeholder="1"/>
            <a title="Deal cards" onclick="dealCards('${gid}', '${pid}')"><i class="fa fa-plus icon"></i></a>
        </div>
    `;
        
    document.getElementById('data-details').innerHTML = html;
}

async function loadDeckDetails(gid) {}

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

    document.getElementById('data-details').innerHTML = '';
    loadGame(gid);
}

async function dealCards(gid, pid) {
    var qt = document.getElementById('numberOfCards').value;
    if(qt <= '0' || qt == undefined) qt = '1';

    let response = await fetch(`/api/add/player_cards?gid=${gid}&pid=${pid}&qt=${qt}`);
    var result = await response.json();

    loadGame(gid);
    loadPlayerDetails(gid, pid);
}