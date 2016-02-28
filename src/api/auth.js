'use strict';

var globals = require('../stores/globals');
var dataStore = require('../stores/dataStore');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var crypto = require('crypto');
var bodyParser = require('body-parser');

/**
 * Encryption cypher to anonymize user ids
 * @param  {String} text The value to encrypt
 * @return {String}      The encrypted value
 */
function encrypt(text){
  var cipher = crypto.createCipher('aes-256-ctr',globals.getAppSecret());
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * Setup authentication flow for express with passport.
 * Add all the API endpoints that require authentication.
 * @param  {Object} app Express application
 */
function setupAuth(app) {

  /**
   * High level serialize/de-serialize configuration for passport
   * Called on first login.
   * @param  {Object} user  The user data
   * @param  {Function} done Callback (errors, userData)
   */
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  /**
   * Hook to get additional user data from the database.
   * Results are stored in express session, accessible via the request object.
   * Called on each request.
   * @param  {String} id    The user id
   * @param  {Function} done Callback (errors, userData)
   */
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
    passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/fail' })
  );

  app.get('/fail', function(request, response) {
    response.send("Login Failed");
  });

  // to support JSON-encoded bodies
  app.use( bodyParser.json() );

  // Endpoint to save game data.
  // The data is assumed to be in the request body.
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

  // Endpoint to return the last saved game data for a given user.
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

  // Endpoint to let user check if they are logged in
  app.get('/me', function(req, res, next) {
    if (req.user) {
        res.send(req.user.id);
    } else {
      res.send('');
    }
  });

}


module.exports = setupAuth;
