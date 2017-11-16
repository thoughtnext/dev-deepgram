var _ = require('underscore')
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
      if (body) {
        var assets = []
        var tempAssets = []
        var finalAssets = []
        for (var i = 0; i < body.results.length; i++) {
          var tempHits = []
          for (var j = 0; j < body.results[i].hits.length; j++) {
            if (body.results[i].hits[j].quality > 0.7) {
              tempHits.push(body.results[i].hits[j])
            }
          }
          if(tempHits.length>0){
                      assets.push({
            asset_id: body.results[i].asset_id,
            hits: tempHits
          })
          tempAssets.push(body.results[i].asset_id)
          }

        }

        if (tempAssets.length > 0) {
          db.GetVideoUrlByAssetId(tempAssets)
            .then(function(data) {
              if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                  var temp = _.findWhere(assets, { asset_id: data[i].asset_id });
                  temp['video_url'] = data[i].video_url
                  temp['image_url'] = data[i].image_url
                  console.log(temp)
                  finalAssets.push(temp)
                }
              }

              res.status(200).send(finalAssets)
              deferred.resolve(finalAssets)
            })
        } else {
          res.status(200).send([])
          deferred.resolve([])
        }
      } else {
        res.status(200).send([])
        deferred.resolve([])
      }

    }
  })
  return deferred.promise;
}