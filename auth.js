const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./models/user');

const setupAuth = (app) => {
    app.use(cookieParser());

    app.use(session({
        secret: 'secretserverword',
        resave: true,
        saveUninitialized: true,
    }));

    passport.use(new GitHubStrategy({
        clientID: "ce401715b36d6f8a329e",
        clientSecret: "a11db34370cad6d1b940e6aed66f2d0599129960",
        callbackURL: "http://localhost:3000/github/auth"
    }, (accessToken, refreshToken, profile, done) => {
        User.findOrCreate({
            where: {
                github_id: profile.id
            }
        })
        .then(result => {
            return done(null, result[0]);
        })
        .catch(done);
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        done(null, id);
    })

    app.use(passport.initialize());

    app.use(passport.session());

    app.get('/login', passport.authenticate('github'));

    app.get('/logout', (req, res, next) => {
        req.logout(); 
        res.redirect('/'); 
    });

    app.get('/github/auth',
        passport.authenticate('github', { 
            failureRedirect: '/login'
        }),
        (req, res) => {
            res.redirect('/');
        });
};

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next ();
    }
    res.redirect('/login');
};

module.exports = setupAuth;
module.exports.ensureAuthenticated = ensureAuthenticated; 


//cookie - little bits of information that's stored on the client website. 