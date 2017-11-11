var Q = require('q')
var request = require('request')
var Adapter = require("../database/Adapter");
var db = new Adapter()

exports.search = function(req, res) {
  var deferred = Q.defer();

  var options = {
    method: 'POST',
    url: 'https://brain.deepgram.com/assets/search',
    headers: {
      'content-type': 'application/json',
      authorization: process.env.DEEPGRAM_AUTH
    },
    body: { query: req.body.query },
    json: true
  };

  request(options, function(error, response, body) {
    if (error) {
      res.status.send({ error: error })
      deferred.reject(error);
    } else {
      var asset_ids = []
      for (var i = 0; i < body.results.length; i++) {
        if (body.results[i].hits[0].quality > 0.5) {
          asset_ids.push(body.results[i].asset_id)
        }
      }
      if (asset_ids.length > 0) {
        db.GetVideoUrlByAssetId(asset_ids)
          .then(function(data) {
            res.status(200).send(data)
            deferred.resolve(data)
          })
      } else {
        res.status(200).send([])
        deferred.resolve([])
      }
    }
  })
  return deferred.promise;
}