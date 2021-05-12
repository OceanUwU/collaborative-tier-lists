var router = require('express').Router();
const db = require.main.require('./models');
const {loadUserProfile} = require.main.require('./passport');

router.get('/:listID', async (req, res) => {
    let list = await db.List.findOne({
        where: {
            id: req.params.listID
        }
    });
    if (list != null) {
        let items = await db.Item.findAll({
            where: {
                list: list.id
            }
        });

        tiers = {};
        for (let item of items) {
            let submissions = await db.SubmissionItem.findAll({
                where: {
                    item: item.id
                }
            });

            let total = 0;

            for (let submission of submissions) {
                total += submission.tier;
            }


            let data = {
                submitters: submissions.length,
            };

            data.tier = data.submitters > 0 ? Math.round(total / data.submitters) : null;

            tiers[item.id] = data;
        }

        let submitters = (await db.Submission.findAll({
            where: {
                list: list.id
            }
        })).length;

        let userSubmission = req.user ? await db.Submission.findOne({
            where: {
                list: list.id,
                submittedBy: req.user.id
            }
        }) : null;
        
        res.render('list', {
            list,
            creator: await loadUserProfile(list.createdBy),
            items: JSON.stringify(items),
            tiers: JSON.stringify(tiers),
            submitters,
            userSubmission
        });
    } else
        res.render('list', {list});
});

module.exports = router;