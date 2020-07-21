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

function createCard(card, draggable = false) {
    let cardElem = $('<div class="tier-card" id="tierCard'+card.id+'"'+(draggable ? ' draggable="true"' : '')+(card.type == 1 ? ' style="background-image: url(/itemimg/'+card.id+'.jpg);"' : '')+'>'+(card.type == 0 ? card.data : '')+'</div>');
    if (draggable)
        cardElem.addClass('tier-card-draggable');
    return cardElem;
}

createBoard();