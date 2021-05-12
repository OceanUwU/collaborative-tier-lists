$('#publicCheck').prop('checked', isPublic);
const maxItemCount = Number($("#maxItemCount").html());
var itemCount = 0;

function addListItem(item = null) {
    if (itemCount < maxItemCount) {
        let newListItem;
        if (item == null)
            newListItem = $($("#listItemText").html());
        else if (item.type == 0) {
            newListItem = $($("#listItemText").html()); 
            newListItem.find('.tier-card').find('span').html(item.data);
        } else if (item.type == 1) {
            newListItem = $($("#listItemImage").html());
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/itemimg/'+item.id+'.jpg', true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = e => newListItem.find('.tier-card').css('background-image', 'url(data:image/jpeg;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(xhr.response))));;
            xhr.send();
        }

        newListItem.attr('itemid', item == null ? 'new' : item.id);
        $("#items").append(newListItem);
        itemCount++;
        updateItemCount();
    } else
        bootbox.alert("You've reached the maximum of "+maxItemCount+" items.");
}

function removeListItem(item) {
    item.parent().remove();
    itemCount--;
    updateItemCount();
}

function updateItemCount() {
    $("#itemCount").html(itemCount);
}

function itemTextUpdate(element) {
    if (element.text().length == 0)
        setTimeout(element => {if (element.text().length == 0) element.text('Item name');}, 1000, element);
}

function switchToImage(inputElement) {
    if (inputElement.files && inputElement.files[0]) {
        var reader = new FileReader();

        reader.onload = e => {
            let oldInput = $(inputElement).parent().parent();
            let img = new Image();
            img.onload = () => {
                let canvas = $('<canvas>')[0];
                canvas.width = 100;
                canvas.height = 80;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                
                let newInput = $($('#listItemImage').html());
                newInput.attr('itemid', oldInput.attr('itemid'));
                newInput.find('.tier-card').css('background-image', 'url('+ctx.canvas.toDataURL('image/jpeg', 0.5)+')');
                oldInput.replaceWith(newInput);
            }
            img.src = e.target.result;
        };

        reader.readAsDataURL(inputElement.files[0]);
    }
}

function switchToText(element) {
    let newInput = $($('#listItemText').html());
    newInput.attr('itemid', element.parent().attr('itemid'));
    element.parent().replaceWith(newInput);
}

function getInputData(e) {
    let inputType = e.attr('inputtype');
    let data = {i: e.attr('itemid'), t: inputType};
    switch (inputType) {
        case 'text':
            textElem = e.find('.tier-card').find('span');
            data.d = textElem.html();
            if (data.d.length > textElem.attr('maxlength'))
                return 'The item "'+data.d+'" is longer than the maximum of 50 characters.';
            if (data.d.length == 0)
                return 'Text items cannot have empty text.';
            break;
        
        case 'image':
            data.d = e.find('.tier-card').css('background-image').slice(5,-2); //find the image of the tier card and remove the "url(" and ")" parts of it
            break;
    }
    return data;
}

function submit() {
    var items = $('#items');
    let itemCount = 0;
    results = [];
    
    let err = null;

    items.children().each((i, e) => {
        let data = getInputData($(e));
        if (typeof data == 'string')
            err = data;
        results.push(data);
        itemCount++;
    });

    if (err)
        return bootbox.alert(err);

    let postData = JSON.stringify(results)
    if (postData.length > 100000000)
        return bootbox.alert("The list size must not exceed 100 MB");
    if (itemCount <= 0)
        return bootbox.alert("You have to have at least one item!");
    
    $.post('', {
        name: $('#listName').val(),
        desc: $('#listDesc').val(),
        public: $('#publicCheck').prop('checked'),
        data: postData
    },
    data => {
        if (data.err)
            bootbox.alert(err);
        else if (data.success == true)
            window.location.replace('/list/'+data.id);
    });
}

function main() {
    if (existingItems == null) {
        const startingListItems = 5;
        for (let i = 0; i < startingListItems; i++)
            addListItem();
    } else {
        for (let item of existingItems)
            addListItem(item);
    }
}

main();