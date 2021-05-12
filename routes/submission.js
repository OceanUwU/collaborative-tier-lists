var router = require('express').Router();
const db = require.main.require('./models');
const {loadUserProfile} = require.main.require('./passport');

router.get('/:submissionID', async (req, res) => {
    let submission = await db.Submission.findOne({
        where: {
            id: req.params.submissionID
        }
    });
    if (submission != null) {
        let list = await db.List.findOne({where: {id: submission.list}});
        let items = await db.Item.findAll({
            where: {
                list: list.id
            }
        });
        let submissionItems = await db.SubmissionItem.findAll({
            where: {
                submission: submission.id
            }
        });
        
        res.render('submission', {
            list,
            submitter: await loadUserProfile(submission.submittedBy),
            items: JSON.stringify(items),
            submissionItems: JSON.stringify(submissionItems),
        });
    } else
        res.render('submission', {list});
});

module.exports = router;