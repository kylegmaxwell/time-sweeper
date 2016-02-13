var express = require('express');
var globals = require('./src/stores/globals')

var app = express();

app.set('port', globals.getPort());

app.use(express.static('public'));

app.get('/cool/:id', function(request, response) {
    response.send("HI");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
