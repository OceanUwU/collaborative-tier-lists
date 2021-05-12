$('#untieredItems').hide();
let i = 0;
for (let item of items) {
    let submissionItem = submissionItems.find(s => s.item == item.id)
    if (submissionItem == undefined) {
        $('#untieredItems').show();
        divToAppendTo = $('#cardBank')
    } else
        divToAppendTo = $('#tierRow'+submissionItem.tier);
    divToAppendTo.append(createCard(item, false, 'tierCard'+(i++)));
}