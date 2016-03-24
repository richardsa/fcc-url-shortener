'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
//var timeHandler = require(path + '/app/controllers/timekHandler.server.js');
// establish mongoose connection
var mongoose = require('mongoose');
var url = process.env.MONGO_URI;

var baseURL = 'https://desolate-reef-39739.herokuapp.com/';
var isObj = true;
var urls = {
  "https://www.google.com": baseURL + "0",
  "http://freecodecamp.com/news": baseURL + "1"
};
var id = 2;
var answer;
var notIn = {
  "error": "No short url found for given input"
};
module.exports = function(app, passport) {

  app.route('/')
    .get(function(req, res) {
      res.sendFile(path + '/public/index.html');
    });
    
  app.route('/:id') // '/:href(.+)'
    .get(function(req, res) {
      var short = req.params.id;
      returnFull(short);
      if (isObj) {
        res.send(notIn);
      } else {
        answer = hasHTTP(answer);
        res.redirect(answer);
        return res.end();
      }

    });

  app.route('/new/:url(*)') // allow forward slashes in route: http://stackoverflow.com/a/24366031
    .get(function(req, res) {
      var query = req.params.url;
      // valid url reg ex taken from http://stackoverflow.com/a/3890175
      if (/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim.test(query) || /(^|[^\/])(www\.[\S]+(\b|$))/gim.test(query)) {
        query = inSystem(query);
        var solution = {};
        solution["original_url"] = req.params.url;
        solution["short_url"] = urls[req.params.url];
        res.send(solution);
      } else {
        res.send({
          "error": "URL invalid"
        });
      }


    });

  function returnFull(urlID) {
    isObj = true;
    for (var key in urls) {
      if (urls[key] == baseURL + urlID) {
        isObj = false;
        answer = key;
        console.log(answer);
        return answer;
      }
    }
    return answer;
  }

  function hasHTTP(x) {
    var http = "http://";
    var https = "https://";

    if (x.substring(0, 7) != http && x.substring(0, 8) != https) {
      x = http + x;
    }

    return x;
  }

  function inSystem(url) {
    if (urls.hasOwnProperty(url)) {

      return urls;
    } else {

      var shortened = baseURL + id;
      urls[url] = shortened;
      id += 1;
      return urls;
    }


  }
  /*	app.route('/timestamp')
		 .post(function(req, res) {
		 	var x = req.body.split('');
     //console.log(res.send(req.body.str.split('').reverse().join('')));
     console.log(x);
     res.sendFile(path + '/public/timestamp.html');
    })*/

  /*	app.route('/login')
  		.get(function (req, res) {
  			res.sendFile(path + '/public/login.html');
  		});*/
  /*  app.route('/timestamp/')

    .get(function(req, res) {

      res.sendFile(path + '/public/timestamp.html');
    });*/


  /* app.route('/logout')
     .get(function(req, res) {

       res.redirect('/login');
     });

   app.route('/profile')
     .get(function(req, res) {
       res.sendFile(path + '/public/profile.html');
     });

   app.route('/api/:id')
     .get(function(req, res) {
       res.json(req.user.github);
     });

   app.route('/auth/github')
     .get(passport.authenticate('github'));

   app.route('/auth/github/callback')
     .get(passport.authenticate('github', {
       successRedirect: '/',
       failureRedirect: '/login'
     }));*/

  /*app.route('/api/:id/clicks')
  	.get(isLoggedIn, clickHandler.getClicks)
  	.post(isLoggedIn, clickHandler.addClick)
  	.delete(isLoggedIn, clickHandler.resetClicks);*/
};