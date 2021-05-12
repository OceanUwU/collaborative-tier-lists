var router = require('express').Router();
const cfg = require.main.require('./cfg');

function requireAuth(req, res, next) {
    if (req.user == undefined) //if user is not logged in
        res.render('auth-needed', {returnTo: req.originalUrl});
    else
        next();
}


//all routes which don't require authentication to use
router.use('/', require('./home'));
router.use('/', require('./auth'));
router.use('/list', require('./list'));
router.use('/submission', require('./submission'));

//function to require authentication to all routes after this
router.use(requireAuth);

//all routes which require authentication to use
router.use('/create-list', require('./create-list'));
router.use('/edit-list', require('./create-list'));
router.use('/delete-list', require('./delete-list'));
router.use('/list/:listID/submit-tiers', require('./submit-tiers'));
router.use('/my-lists', require('./my-lists'));
router.use('/my-submissions', require('./my-submissions'));

module.exports = router;