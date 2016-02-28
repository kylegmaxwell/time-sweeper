'use strict';

var globals = require('../stores/globals');
var dataStore = require('../stores/dataStore');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var crypto = require('crypto');
var bodyParser = require('body-parser');

function encrypt(text){
  var cipher = crypto.createCipher('aes-256-ctr',globals.getAppSecret());
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function setupAuth(app) {

  // High level serialize/de-serialize configuration for passport
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    done(null, {"id":id});
  });

  // Facebook-specific
  passport.use(new FacebookStrategy(
    {
      clientID: globals.getFacebookId(),
      clientSecret: globals.getFacebookSecret(),
      callbackURL: globals.getCallbackUrl()
    },
    function(accessToken, refreshToken, profile, done) {
      console.info('Login');
      // Encrypt the user id from facebook so it's safe from people
      // snooping on our database
      done(null, {"id":encrypt(profile.id)});
    }));

  // Express middlewares
  app.use(require('express-session')({
    secret: globals.getAppSecret(),
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Express routes for auth
  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/static', failureRedirect: '/fail' }),
    function(req, res) {
      console.log('response');
    }
    );

  app.get('/fail', function(request, response) {
    response.send("Login Failed");
  });

// to support JSON-encoded bodies
app.use( bodyParser.json() );

app.post('/save', function(req, res, next) {
  if (req.user) {
    dataStore.persist(req.user.id, req.body, function reslove(data) {
      res.send('Success');
    }, function reject() {
      res.send('DB Failure');
    });
  } else {
    res.send('Not logged in');
  }
});

app.get('/load', function(req, res, next) {
  if (req.user) {
    dataStore.query(req.user.id, function reslove(data) {
      res.send(data);
    }, function reject() {
      res.send('DB Failure');
    });
  } else {
    res.send('Not logged in');
  }

});

}


module.exports = setupAuth;
