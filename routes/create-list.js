var router = require('express').Router();
const db = require.main.require('./models');
const fs = require('fs');
const dataUriPrefixLength = 'data:image/jpeg;base64,'.length;

const maxNameLength = 150;
const maxDescLength = 1000;
const maxListItems = 1000;
const maxItemTextLength = 50;

router.use(async (req, res, next) => {
    if (req.query.id) {
        let list = await db.List.findOne({
            where: {
                id: req.query.id
            }
        });

        if (list.createdBy);
        
        if (list == null)
            res.render('list', {list: null});
        else if (list.createdBy != req.user.id)
            res.render('blank', {title: 'You\'re not the creator of this list.'});
        else {
            res.locals.list = list;
            res.locals.items = await db.Item.findAll({
                where: {
                    list: list.id
                }
            });
            next();
        }
    } else
        next();
});

router.get('/', (req, res) => {
    res.render('create-list', {maxNameLength, maxDescLength, maxListItems, maxItemTextLength});
});

function giveError(err, res) {
    res.json({error: err});
}

router.post('/', async (req, res) => {
    if (!req.body.hasOwnProperty('name') || typeof req.body.name != 'string')
        return;
    if (req.body.name.length > maxNameLength)
        return;
    if (req.body.name.length == 0)
        req.body.name = null;
    if (!req.body.hasOwnProperty('desc') || typeof req.body.desc != 'string')
        return;
    if (req.body.desc.length > maxDescLength)
        return;
    if (req.body.desc.length == 0)
        req.body.desc = null;
    if (!req.body.hasOwnProperty('public'))
        return;
    req.body.public = req.body.public == 'true';
    if (!req.body.hasOwnProperty('data') || typeof req.body.data != 'string')
        return;
    let data = JSON.parse(req.body.data);
    if (!Array.isArray(data))
        return;
    if (data.length > maxListItems)
        return;

    for (let item of data) {
        if (typeof item != 'object')
            return;
        if (!(item.hasOwnProperty('i') && typeof item.i == 'string' && item.hasOwnProperty('t') && typeof item.t == 'string' && item.hasOwnProperty('d') && typeof item.d == 'string'))
            return;
        switch (item.t) {
            case 'text':
                if (item.length > maxItemTextLength || item.length == 0)
                    return;
                break;

            case 'image':
                if (item.d.length <= dataUriPrefixLength)
                    return giveError('One of the images is empty.', res);
                break;

            default:
                return;
        }
    }


    let list, items;

    let editing = res.locals.list != null;
    let listData = {
        name: req.body.name,
        desc: req.body.desc,
        public: req.body.public,
        createdBy: req.user.id
    };

    if (editing) {
        list = res.locals.list;
        items = res.locals.items.map(item=>item.id);
        itemsNotFound = [...items];

        for (let item of data) {
            if (item.i != 'new' && !items.includes(item.i))
                return;
                itemsNotFound.splice(itemsNotFound.indexOf(item.i), 1);
        }

        for (let item of itemsNotFound) {
            db.Item.destroy({where: {id: item}});
            db.SubmissionItem.destroy({where: {item: item}});
        }

        for (let item of items) {
            let imgPath = './public/itemimg/'+item+'.jpg';
            if (fs.existsSync(imgPath))
                fs.unlinkSync(imgPath);
        }

        await db.List.update(listData, {where: {id: res.locals.list.id}});
    } else {
        list = await db.List.create(listData);
    }

    if (!fs.existsSync('./public/itemimg'))
        fs.mkdirSync('./public/itemimg');

    for (let item of data) {
        let newItem = {list: list.id, data: null};
        switch (item.t) {
            case 'text':
                newItem.type = 0;
                newItem.data = item.d;
                /*await db.Item.create({
                    list: list.id,
                    type: 0,
                    data: item.d
                });*/
                break;

            case 'image':
                newItem.type = 1;
                /*var savedItem = await db.Item.create({
                    list: list.id,
                    type: 1,
                    data: null
                });*/
                break;
        }

        let savedItem;

        if (editing && item.i != 'new') {
            await db.Item.update(newItem, {where: {id: item.i}});
            savedItem = await db.Item.findOne({where: {id: item.i}});
        } else
            savedItem = await db.Item.create(newItem);

        if (savedItem.type == 1)
            fs.writeFile('./public/itemimg/'+savedItem.id+'.jpg', Buffer.from(item.d.slice(dataUriPrefixLength), 'base64'), ()=>{});
    }

    res.json({success: true, id: list.id});
});

module.exports = router;