var router = require('express').Router();
const db = require.main.require('./models');

router.get('/', async (req, res) => {
    let submissions = await db.Submission.findAll({
        where: {
            submittedBy: req.user.id
        }
    });

    let lists = [];

    for (submission of submissions) {
        lists.push(await db.List.findOne({
            where: {
                id: submission.list
            }
        }));
    }

    res.render('my-submissions', {lists});
});

module.exports = router;