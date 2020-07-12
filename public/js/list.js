$('#untieredItems').hide();
for (i in items) {
    if (tieredItems[i] == null) {
        $('#untieredItems').show();
        divToAppendTo = $('#cardBank')
    } else
        divToAppendTo = $('#tierRow'+tieredItems[i]);
    divToAppendTo.append(createCard(items[i], false, 'tierCard'+i));
}