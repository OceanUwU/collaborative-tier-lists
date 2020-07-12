var router = require('express').Router();
const db = require.main.require('./models');

router.get('/', (req, res) => {
    res.render('create-list');
});

router.post('/', async (req, res) => {
    console.log(req.body)
    if (!req.body.hasOwnProperty('listName') || typeof req.body.listName != 'string')
        return;
    if (req.body.listName.length > 50)
        return;
    if (req.body.listName.length == 0)
        req.body.listName = null;
    if (!req.body.hasOwnProperty('items') || !Array.isArray(req.body.items))
        return;
    if (req.body.items.length > 200)
        return;
    for (let item of req.body.items) {
        if (typeof item != 'string')
            return;
        if (item.length > 50 || item.length == 0)
            return;
    }
    console.log("success")
    var list = await db.List.create({
        name: req.body.listName,
        createdBy: req.user.id,
        items: JSON.stringify(req.body.items)
    });

    res.redirect("/list/"+list.id)
});

module.exports = router;