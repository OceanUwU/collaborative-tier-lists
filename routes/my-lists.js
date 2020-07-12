var router = require('express').Router();
const db = require.main.require('./models');

router.get('/', async (req, res) => {
    let lists = await db.List.findAll({
        where: {
            createdBy: req.user.id
        }
    });

    res.render('my-lists', {lists});
});

module.exports = router;