var router = require('express').Router();
const db = require.main.require('./models');
const {loadUserProfile} = require.main.require('./passport');
console.log(db);

router.get('/:listID', async (req, res) => {
    let list = await db.List.findOne({
        where: {
            id: req.params.listID
        }
    });
    if (list != null) {
        let submissions = await db.Submission.findAll({
            where: {
                list: list.id
            }
        });

        tiers = [];
        for (i in JSON.parse(list.items))
            tiers.push({
                submitters: 0,
                total: 0
            });
        
        let userHasSubmitted = false;
        for (let submission of submissions) {
            let data = JSON.parse(submission.data);
            for (let i = 0; i < data.length; i++) {
                let rating = data[i];
                if (rating != null) {
                    tiers[i].submitters++;
                    tiers[i].total += rating;
                }
            }
            if (!userHasSubmitted && req.user != undefined && submission.submittedBy == req.user.id)
                userHasSubmitted = true;
        }

        for (let i in tiers) {
            let item = tiers[i];
            if (item.submitters == 0)
                tiers[i] = null;
            else
                tiers[i] = Math.round(item.total / item.submitters);
        }
        
        res.render('list', {
            list,
            creator: await loadUserProfile(list.createdBy),
            tiers: JSON.stringify(tiers),
            submitters: submissions.length,
            userHasSubmitted
        });
    } else
        res.render('list', {list});
});

module.exports = router;