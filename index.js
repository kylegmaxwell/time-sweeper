'use strict';

var express = require('express');
var globals = require('./src/stores/globals')
var auth = require('./src/api/auth')
var passport = require('passport');

var app = express();

app.set('port', globals.getPort());

auth(app);

app.use('/',express.static('public'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
