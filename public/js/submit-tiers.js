var cardBank = $("#cardBank")

var bank = document.querySelector("#cardBank");

for (i in items) {
    let divToAppendTo;
    if (currentSubmission == null || currentSubmission[i] == null)
        divToAppendTo = $(cardBank);
    else
        divToAppendTo = $('#tierRow'+currentSubmission[i]);
    divToAppendTo.append(createCard(items[i], true, "tierCard"+i));
}

const allowDrag = (event) => event.preventDefault();

function dropInto(event) {
    event.preventDefault();
    //only allow dropping into rows
    let element = $(event.target);
    let eligibleToDropInto = (element.hasClass('tier-row') || element.attr('id') == "cardBank");
    console.log(element);
    if (!eligibleToDropInto) {
        element = element.parent();
        if (!eligibleToDropInto) return;
    }
    if (eligibleToDropInto) {
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
    $(".tier-card").each((i, e) => {
        let cardValue;
        if ($(e).parent().attr('id') == "cardBank")
            cardValue = null;
        else
            cardValue = Number($(e).parent().attr('id').substring("tierRow".length));
        
        items[Number(e.id.substring("tierCard".length))] = cardValue;
    });

    var form = $('<form action="" method="post">');
    form.hide();
    form.append($('<input name="tiers" value="'+JSON.stringify(items)+'">'));
    $("body").append(form);
    form.submit();
}