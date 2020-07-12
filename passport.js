const passport = require('passport');
const IdentificatorStrategy = require('passport-identificator').Strategy;
const cfg = require("./cfg");

passport.use(new IdentificatorStrategy(
    {
        "identificatorHost": cfg.identificatorHost,
        "callbackURL": cfg.host+"/login/callback",
    },

    (profile, cb) => {
        cb(null, profile.id);
    }
));

passport.serializeUser((profile, cb) => {
    return cb(null, profile);
});

passport.deserializeUser((id, cb) => {
    IdentificatorStrategy.loadUserProfile(cfg.identificatorHost, id, cb);
});

module.exports = passport;
module.exports.loadUserProfile = function(id) {
    return new Promise((res, rej) => {
        require('passport-identificator').Strategy.loadUserProfile(require.main.require('./cfg').identificatorHost, id, (err, profile) => {
            res(profile);
        });
    });
}