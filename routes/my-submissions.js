var router = require('express').Router();
const db = require.main.require('./models');

router.get('/', async (req, res) => {
    let submissions = await db.Submission.findAll({where: {submittedBy: req.user.id}});

    let lists = await Promise.all(submissions.map(s => db.List.findOne({where: {id: s.list}})));

    res.render('my-submissions', {submissions, lists});
});

module.exports = router;