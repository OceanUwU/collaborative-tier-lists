const tiers = [
    ['S', '2fde26'],
    ['A', '7ef041'],
    ['B', 'f6ff00'],
    ['C', 'e3961b'],
    ['F', 'ff1900']
]

function createBoard() {
    var board = $('#board');
    for (let i = 0; i < tiers.length; i++) {
        let tier = tiers[i];
        board.append('<div class="tier-row" id="tierRow'+i+'"><div class="tier-row-label" style="background-color: #'+tier[1]+';">'+tier[0]+'</div></div>');
    }
}

function createCard(cardData, draggable = false, id = null) {
    let card = $('<div class="tier-card"'+(id != null ? ' id="'+id+'"' : '')+(draggable ? ' draggable="true"' : '')+'>'+cardData+'</div>');
    if (draggable)
        card.addClass('tier-card-draggable');
    return card;
}

createBoard();