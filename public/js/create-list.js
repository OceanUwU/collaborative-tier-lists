const maxItemCount = Number($("#maxItemCount").html());
var itemCount = 0;

function addListItem() {
    if (itemCount < maxItemCount) {
        let newListItem = $($("#listItem").html())
        $("#items").append(newListItem);
        onItemChange(newListItem.find("input"));
        itemCount++;
        updateItemCount();
    } else
        alert("You've reached the maximum of "+maxItemCount+" items.");
}

function removeListItem(item) {
    item.parent().remove();
    itemCount--;
    updateItemCount();
}

function updateItemCount() {
    $("#itemCount").html(itemCount);
}

function onItemChange(item) {
    if (item.val().length == 0)
        item.addClass("is-invalid");
    else
        item.removeClass("is-invalid");
}

function submit() {
    var form = $("#list");
    if (itemCount <= 0)
        alert("You have to have at least one item!");
    else {
        for (let i of $("#items").children()) {
            let item = $(i).find("input");
            if (item.val().length == 0)
                return alert("All items must be named.");
        }
        var newForm = form.clone();
        newForm.hide();
        $("body").append(newForm);
        newForm.submit();
    }
}

function main() {
    const startingListItems = 5;
    for (let i = 0; i < startingListItems; i++)
        addListItem();
}

main();