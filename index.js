const express = require('express');
const bodyParser = require('body-parser')
const expresssession = require('express-session');
const cookieParser = require('cookie-parser');
const identificatorHost = "https://identificator.xyz";

const cfg = require("./cfg");

var app = express();
app.set('views', './views')
app.set('view engine', 'pug');
app.use('/', express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.use(expresssession({secret: cfg.secret, resave: false, saveUninitialized: true}));

const passport = require('./passport');
const db = require('./models');

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals = {
        user: req.user,
        originalUrl: req.originalUrl
    };
    next();
});

app.use(require("./routes"));


const server = app.listen(cfg.port, () => {
    console.log('Web server started.');
});