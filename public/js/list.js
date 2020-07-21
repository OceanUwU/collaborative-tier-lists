$('#untieredItems').hide();
for (let i in items) {
    let tier = tieredItems[items[i].id].tier;
    if (tier == null) {
        $('#untieredItems').show();
        divToAppendTo = $('#cardBank')
    } else
        divToAppendTo = $('#tierRow'+tier);
    divToAppendTo.append(createCard(items[i], false, 'tierCard'+i));
}

function deleteList() {
    bootbox.confirm({
        message: "Are you sure you want to delete this list? All the images you've uploaded will be lost, and any tiers people have submitted to it will be lost.",
        buttons: {
            confirm: {
                label: 'Delete',
                className: 'btn-danger'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-secondary'
            }
        },
        callback: result => {
            if (result)
                $.post('/delete-list', {id: listId}, data => {
                    console.log(data);
                    if (data)
                        window.location.replace('/');
                });
        }
    });
    
}