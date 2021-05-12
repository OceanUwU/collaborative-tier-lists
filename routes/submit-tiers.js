var router = require('express').Router({mergeParams: true});
const db = require.main.require('./models');
const availableTiers = [null, 0, 1, 2, 3, 4];

router.use(async (req, res, next) => {
    let list = await db.List.findOne({
        where: {
            id: req.params.listID
        }
    });

    res.locals.list = list;

    if (list != null)
        next();
    else
        res.render('submit-tiers');
});

router.get('/', async (req, res) => {
    let items = await db.Item.findAll({
        where: {
            list: res.locals.list.id
        }
    });

    let submission = await db.Submission.findOne({
        where: {
            submittedBy: req.user.id,
            list: res.locals.list.id
        }
    });

    let currentSubmission = null;
    if (submission != null) {
        currentSubmission = await db.SubmissionItem.findAll({
            where: {
                submission: submission.id
            }
        });
    }

    res.render('submit-tiers', {items, currentSubmission});
});

router.post('/', async (req, res) => {
    let items = (await db.Item.findAll({
        where: {
            list: res.locals.list.id
        }
    })).map(i => i.id);

    if (!req.body.hasOwnProperty('tiers') || typeof req.body.tiers != 'string')
        return;
    let tiers = JSON.parse(req.body.tiers);
    if (typeof tiers != 'object')
        return;
    for (i in tiers) {
        if (!items.includes(i))
            return;
        if (!availableTiers.includes(tiers[i]))
            return;
    }

    let submission = await db.Submission.findOne({
        where: {
            submittedBy: req.user.id,
            list: res.locals.list.id
        }
    });
    if (submission == null) {
        submission = await db.Submission.create({
            submittedBy: req.user.id,
            list: res.locals.list.id,
        });
    }

    for (i in tiers) {
        let itemSubmission = await db.SubmissionItem.findOne({
            where: {
                submission: submission.id,
                item: i
            }
        });
        if (tiers[i] != null) {
            if (itemSubmission == null) {
                await db.SubmissionItem.create({
                    submission: submission.id,
                    item: i,
                    tier: tiers[i]
                }).catch(err=>console.log(err));
            } else {
                await db.SubmissionItem.update({
                    tier: tiers[i]
                },
                {
                    where: {
                        submission: submission.id,
                        item: i
                    }
                });
            }
        } else if (itemSubmission != null) {
            await db.SubmissionItem.destroy({
                where: {
                    submission: submission.id,
                    item: i
                }
            });
        }
    }
    res.redirect(`/submission/${submission.id}`);
});

module.exports = router;