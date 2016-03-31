'use strict';

function UrlHandler() {
  var Urls = require('../models/urls.js');
  var Counters = require('../models/counters.js');
  var counterID;
  var baseURL = 'https://desolate-reef-39739.herokuapp.com/';
  var shortened = baseURL + 0;
  var notIn = {
    "error": "No short url found for given input"
  };

  // add http:// to beginning of url before storing it in database
  // necessary for proper redirects
  function hasHTTP(x) {
    var http = "http://";
    var https = "https://";
    if (x.substring(0, 7) != http && x.substring(0, 8) != https) {
      x = http + x;
    }

    return x;
  }
  // function to check url submitted by user
  // if already exists, existing combination will be displayed after querying database
  // if unique, will be added to database and results will be returned
  // invalid url's will return an error message

  this.getShortened = function(req, res) {
    /*idCounter += 1;
    var short = baseURL + idCounter;*/
    var clickProjection = {
      '_id': false
    };
    var query = req.params.url;
    // valid url reg ex taken from http://stackoverflow.com/a/3890175
    if (/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim.test(query) || /(^|[^\/])(www\.[\S]+(\b|$))/gim.test(query)) {
      query = hasHTTP(query);
      // insert counterval if does not exists 
      // added since initial counter variable was reset after restarting server
      Counters.collection.findOne({}, clickProjection, function(err, result) {
        if (err) {
          throw err;
        }

        if (result) {
          console.log(result);
          counterID = result["counterVal"];

        } else {

          Counters.collection.insert({
            'counterVal': 1
          }, function(err) {
            if (err) {
              throw err;
            }


          });
        }
      });

      Urls.collection.findOne({
        "original_url": query
      }, clickProjection, function(err, result) {
        if (err) {
          throw err;
        }

        if (result) {
          console.log("1 " + JSON.stringify(result));
          res.send(result);
        } else {

          Counters.collection.findAndModify({}, {
            '_id': 1
          }, {
            $inc: {
              'counterVal': 1
            }
          }, function(err, updatedResult) {
            if (err) {
              throw err;
            }
            counterID = updatedResult.value.counterVal;
            shortened = baseURL + counterID;
            console.log("counterID " + counterID);
            console.log("shortend valude " + shortened);
            console.log("outsie shodrtened " + shortened)
            Urls.collection.insert({
              "original_url": query,
              "short_url": shortened

            }, function(err) {
              if (err) {
                throw err;
              }
              //  return shortened;
              //  console.log("last " + testing);
            });
            /*console.log("outsie shodrtened " + shortened)
            Urls.collection.insert({
              "original_url": query,
              "short_url": shortened
              
            }, function(err) {
              if (err) {
                throw err;
              } */
            Urls.collection.findOne({
              "original_url": query
            }, clickProjection, function(err, doc) {
              if (err) {
                throw err;
              }
              console.log("doc " + doc["short_url"]);

              console.log("2 " + JSON.stringify(doc));
              res.send(doc);
            });


            /*  Urls.collection.findOne({
                "original_url": query
              }, clickProjection, function(err, doc) {
                if (err) {
                  throw err;
                }
                console.log("doc " + doc["short_url"]);
              
                console.log("2 " + JSON.stringify(doc));
                res.send(doc);
              });*/
          });
        }
      });
    } else {
      res.send({
        "error": "URL invalid"
      });
      res.end();
    }



  };

  // function to check if id exists 
  // if so - user is redirected to full url
  this.getFull = function(req, res) {
    var idQuery = req.params.id;
    var full = baseURL + idQuery;
    var clickProjection = {
      '_id': false
    };
    Urls.collection.findOne({
      "short_url": full
    }, clickProjection, function(err, result) {
      if (err) {
        throw err;
      }

      if (result) {
        var redirectUrl = result["original_url"];
        console.log(result["short_url"]);
        //res.send(result);
        res.redirect(redirectUrl);
        return res.end();
      } else {

        res.send(notIn);
      }
    });

  };

  // quick and dirty function to clear tables
  this.getDrop = function(req, res) {

    Counters.collection.update({}, {
      'counterVal': 0
    }, function(err, result) {
      if (err) {
        throw err;
      }
      //res.json(result);
    });
    Urls.remove(function(err, p) {
      if (err) {
        throw err;
      } else {
        res.send("Both tables Cleared");
      }
    });

  };

}

module.exports = UrlHandler;