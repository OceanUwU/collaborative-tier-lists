var router = require('express').Router();
var passport = require.main.require('./passport');

router.get('/login', (req, res, next) => {
    if (req.query.hasOwnProperty('returnTo')) //if there is a return url set in the query
        req.session.returnTo = req.query.returnTo; //save it in the user's session to be accessed at /login/callback
    next(); //end middleware
}, passport.authenticate('identificator')); //authenticate with identificator

router.get('/login/callback', passport.authenticate('identificator', {failureRedirect: '/login/fail'}), (req, res) => {
    let returnTo = req.session.returnTo || "/"; //if there is a url to return to set in the user's session, set the return url to that, otherwise set it to the site's home url
    if (req.session.hasOwnProperty('returnTo')) //if there was a url to return to set in the user's session
        delete req.session.returnTo; //get rid of it
    res.redirect(returnTo); //redirect the user to the return url
});

router.get("/login/fail", (req, res) => res.send("There was an error logging in. <a href='/login'>Try again?</a>"));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;