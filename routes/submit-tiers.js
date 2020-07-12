var router = require('express').Router();
const db = require.main.require('./models');
const availableTiers = [null, 0, 1, 2, 3, 4];
const route = '/:listID/submit-tiers';

router.get(route, async (req, res) => {
    let list = await db.List.findOne({
        where: {
            id: req.params.listID
        }
    });
    if (list != null) {
        let currentSubmission = await db.Submission.findOne({
            where: {
                submittedBy: req.user.id,
                list: list.id
            }
        });
        res.render('submit-tiers', {list, currentSubmission});
    } else
        res.render('submit-tiers', {list: null});
});

router.post(route, async (req, res) => {
    let list = await db.List.findOne({
        where: {
            id: req.params.listID
        }
    });

    if (list != null) {
        if (!req.body.hasOwnProperty('tiers') || typeof req.body.tiers != 'string')
            return;
        let items = JSON.parse(req.body.tiers);
        console.log(items);
        console.log(list);
        if (!Array.isArray(items))
            return;
        if (items.length != JSON.parse(list.items).length)
            return;
        for (item of items)
            if (!availableTiers.includes(item))
                return;
        console.log("hmm")
        let isNewSubmission = (await db.Submission.findOne({
            where: {
                submittedBy: req.user.id,
                list: list.id
            }
        }) == null ? true : false);
        if (isNewSubmission) {
            await db.Submission.create({
                submittedBy: req.user.id,
                list: list.id,
                data: JSON.stringify(items)
            });
        } else {
            await db.Submission.update({
                data: JSON.stringify(items)
            },
            {
                where: {
                    submittedBy: req.user.id,
                    list: list.id
                }
            });
        }
        res.redirect(`/list/${list.id}`);
    } else
        res.render('submit-tiers', {list: null});
});

module.exports = router;