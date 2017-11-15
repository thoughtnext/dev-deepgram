
var express = require('express');
var bodyParser = require('body-parser');
// var request = require('request')
var app = express();
var routes = require('./app/routes/index')

require('dotenv').config()

var port = process.env.PORT || 1337;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Accept,Content-Length, X-Requested-With, X-PINGOTHER');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(bodyParser.json());

app.use(allowCrossDomain);
// configuring routes for express apis
routes.configure(app)

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
