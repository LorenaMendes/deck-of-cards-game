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
        `;
    }

    var html = `
        <ul>
            ${ul_content}
        </ul>
    `;

    document.getElementById('games-list').innerHTML = html;
}

async function loadGame(gid) {
    document.getElementById('data-details').innerHTML = '<div class="empty-box">Select a player to show</div>';

    let response = await fetch(`/api/get/game?gid=${gid}`);
    var game = await response.json();
    game = game['game'];
    
    var players = '';
    sorted_players = Object.values(game.players).sort(function compareFn(a, b) {
        if (a.score < b.score) return 1;
        if (a.score > b.score) return -1;
        return 0;
    })

    for (let i=0; i<sorted_players.length; i++) {
        var player = sorted_players[i];
        players += `
            <div class="text-and-icons">
                <a onclick="loadPlayerDetails('${gid}', '${player.id}')">
                    <li class="clickable-text">${player.nick}  -  ${player.score} points</li>
                </a>
                <a title="Kick player" onclick="removePlayer('${gid}', '${player.id}')">
                    <i class="fa fa-ban icon"></i>
                </a>
            </div>
        `;
    }

    var html = `
    <div class="game-data-title">Game: ${game.nick}</div>
    <div class="game-data-display">
    <div class="deck-left-info">
        <br><br>
        <div class="text-and-icons">
            <span>DECK INFO</span>
            <a title="Shuffle deck" onclick="shuffleDeck('${gid}')"><i class="fa fa-random icon"></i></a>
            <a title="Add deck" onclick="addDeck('${gid}')"><i class="fa fa-plus icon"></i></a>
        </div>
        <div class="deck-info">
            <span>Decks in this game: ${game.decks} (${game.decks * 52} cards)</span>
            <span>Dead cards: ${game.deadCards} cards</span>
            <span>Undealt cards: ${game.undealt.length} cards</span>
            <ul>
                <li>${game.cHearts} hearts</li>
                <li>${game.cSpades} spades</li>
                <li>${game.cClubs} clubs</li>
                <li>${game.cDiamonds} diamonds</li>
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
    </div>`;

    response = await fetch(`/api/detail/deck?gid=${gid}`);
    var result = await response.json();
    let count = result.count;

    html += 
    `<div class="deck-det">
        <br>
        <div class="cards-by-type">
    `;

    for (var suit of Object.keys(count)) {
        switch (suit) {
            case 'hearts':
                symbol = '♥';
                html += `<div class="cards-by-type-block red-card"><strong><span>${suit} ♥</span></strong>`
                break;
            case 'clubs':
                symbol = '♣';
                html += `<div class="cards-by-type-block black-card"><strong><span>${suit} ♣</span></strong>`
                break;
            case 'diamonds':
                symbol = '♦';
                html += `<div class="cards-by-type-block red-card"><strong><span>${suit} ♦</span></strong>`
                break;
            case 'spades':
                symbol = '♠';
                html += `<div class="cards-by-type-block black-card"><strong><span>${suit} ♠</span></strong>`
                break;
        }
        
        for (var face of Object.keys(count[suit])) {
            html += `<span><strong>${face}:</strong> ${count[suit][face]} left</span>`
        }
        html += `</div>`
    }
    html += `</div>`
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

async function loadDeckDetails(gid) {
    let response = await fetch(`/api/detail/deck?gid=${gid}`);
    var result = await response.json();
    let count = result.count;

    console.log(count)
    
    var html = `
        <div class="game-data-title">Game Deck</div>
        <br>
        <div class="cards-by-type">
    `;

    for (var suit of Object.keys(count)) {
        switch (suit) {
            case 'hearts':
                symbol = '♥';
                html += `<div class="cards-by-type-block red-card"><h4>${suit} ♥</h4>`
                break;
            case 'clubs':
                symbol = '♣';
                html += `<div class="cards-by-type-block black-card"><h4>${suit} ♣</h4>`
                break;
            case 'diamonds':
                symbol = '♦';
                html += `<div class="cards-by-type-block red-card"><h4>${suit} ♦</h4>`
                break;
            case 'spades':
                symbol = '♠';
                html += `<div class="cards-by-type-block black-card"><h4>${suit} ♠</h4>`
                break;
        }
        
        for (var face of Object.keys(count[suit])) {
            html += `<span><strong>${face}:</strong> ${count[suit][face]} left</span>`
        }
        html += `</div>`
    }

    document.getElementById('data-details').innerHTML = html;
}

async function addGame(nick) {
    console.log('ADD GAME');

    var nick = document.getElementById('gameNick').value;
    if(nick == '' || nick == undefined) nick = 'no name';

    let response = await fetch(`/api/new/game?nick=${nick}`);
    var result = await response.json();
    if(result.message != 'success') alert(result.message);
    else loadGames();
}

async function removeGame(gid) {
    console.log('REMOVE GAME');

    let response = await fetch(`/api/remove/game?gid=${gid}`);
    var result = await response.json();

    document.getElementById('game-data').innerHTML = '<div class="empty-box">Select a game to show</div>';
    loadGames();
}

async function addDeck(gid) {
    console.log('ADD DECK');

    let response = await fetch(`/api/add/deck?gid=${gid}`);
    var result = await response.json();
    if(result.message != 'success') alert(result.message);
    else loadGame(gid);
}

async function shuffleDeck(gid) {
    console.log('SHUFFLE DECK');

    let response = await fetch(`/api/shuffle/deck?gid=${gid}`);
    var result = await response.json();
    alert(result.message);

    loadGame(gid);
}

async function addPlayer(gid) {
    console.log('ADD PLAYER');

    var nick = document.getElementById('playerNick').value;
    if(nick == '' || nick == undefined) nick = 'no name';

    let response = await fetch(`/api/add/player?gid=${gid}&nick=${nick}`);
    var result = await response.json();
    if(result.message != 'success') alert(result.message);

    loadGame(gid);
}

async function removePlayer(gid, pid) {
    console.log('REMOVE PLAYER');

    let response = await fetch(`/api/remove/player?gid=${gid}&pid=${pid}`);
    var result = await response.json();

    document.getElementById('data-details').innerHTML = '<div class="empty-box">Select a player to show</div>';
    loadGame(gid);
}

async function dealCards(gid, pid) {
    var qt = document.getElementById('numberOfCards').value;
    if(qt <= '0' || qt == undefined) qt = '1';

    let response = await fetch(`/api/add/player_cards?gid=${gid}&pid=${pid}&qt=${qt}`);
    var result = await response.json();
    if(result.message != 'success') alert(result.message);
    else {
        loadGame(gid);
        loadPlayerDetails(gid, pid);
    }

}