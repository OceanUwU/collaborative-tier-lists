var cardBank = $("#cardBank")

var bank = document.querySelector("#cardBank");

let map = currentSubmission == null ? null : currentSubmission.map(e => e.item);
for (i in items) {
    let divToAppendTo;
    
    if (map == null || map.indexOf(items[i].id) == -1)
        divToAppendTo = $(cardBank);
    else
        divToAppendTo = $('#tierRow'+currentSubmission[map.indexOf(items[i].id)].tier);
    divToAppendTo.append(createCard(items[i], true));
}

const allowDrag = (event) => event.preventDefault();

function dropInto(event) {
    event.preventDefault();
    //only allow dropping into rows
    let element = $(event.target);
    let eligibleToDropInto = element => (element.hasClass('tier-row') || element.attr('id') == "cardBank");
    if (!eligibleToDropInto(element)) {
        element = element.parent();
        if (!eligibleToDropInto(element)) return;
    }
    if (eligibleToDropInto(element)) {
        element.append($('#'+event.dataTransfer.getData('id'))[0]);
    }
};

bank.ondragover = allowDrag;
bank.ondrop = dropInto;

$('.tier-card').each((i, e) => {
    e.ondragstart = (event) => {
        event.dataTransfer.setData('id', event.target.id);
    };
});

$('.tier-row').each((i, e) => {
    e.ondragover = allowDrag;
    e.ondrop = dropInto;
});


function submit() {
    let tiers = {};
    $(".tier-card").each((i, e) => {
        let cardValue;
        if ($(e).parent().attr('id') == "cardBank")
            cardValue = null;
        else
            cardValue = Number($(e).parent().attr('id').substring("tierRow".length));
        
        tiers[e.id.substring("tierCard".length)] = cardValue;
    });

    var form = $('<form action="" method="post">');
    form.hide();
    form.append($('<input name="tiers" value=\''+JSON.stringify(tiers)+'\'>'));
    $("body").append(form);
    form.submit();
}