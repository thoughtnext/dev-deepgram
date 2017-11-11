var bodyParser = require('body-parser');
var Adapter = require("../database/Adapter");
var db = new Adapter()


var request = require('request');
var Q = require("q");
var deepgram = require("./deepgram-api");



module.exports = {
  configure: function(app) {
    app.get('/', function(req, res) { res.status(200).send('Hello world!'); });

    // Slack Routes

    app.post('/search', function(req, res, next) {
      // res.status(200).send(req.body)
      return deepgram.search(req, res)
    });

  }
}