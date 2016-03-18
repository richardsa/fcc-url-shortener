'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
//var timeHandler = require(path + '/app/controllers/timekHandler.server.js');

var baseURL = "https://url-shortener-richardsa.c9users.io/";
var isObj = true;
var urls = {};
var id = 0; 
var answer;
var notIn = {"error":"No short url found for given input"};
module.exports = function(app, passport) {

  /*	function isLoggedIn (req, res, next) {
  		if (req.isAuthenticated()) {
  			return next();
  		} else {
  			res.redirect('/timestamp');
  		}
  	}*/


  var clickHandler = new ClickHandler();

  app.route('/')
    .get(function(req, res) {
    	res.sendFile(path + '/public/index.html');
    });
  app.route('/:id') // '/:href(.+)'
    .get(function(req, res) {
      var short = req.params.id;
      console.log(short);
      returnFull(short);
      console.log(answer);
      if (isObj){
        res.send(notIn); 
      } else {
        
        answer = hasHTTP(answer);
        console.log("redirecting to ..." + answer);
        res.redirect(answer);
      // req.url = "www.reddit.com";
        //res.send(answer);
        return res.end();
      }
    	
    });

app.route('/new/:url(*)') // allow forward slashes in route: http://stackoverflow.com/a/24366031
  .get(function(req, res) {
    var query = req.params.url;
    console.log(query);
    // valid url reg ex taken from http://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url
    if (/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(query)){
      query = inSystem(query);
      var solution = {};
      solution["original_url"] = req.params.url;
      console.log(urls[query]);
      solution["short_url"] = urls[req.params.url];
      res.send(solution);
    } else {
      
     res.send({"error":"URL invalid"}); 
    }
      
    
  });
function returnFull (urlID){
 
  for (var key in urls) {
    console.log(urls[key]);
    console.log(urlID);
  if (urls[key] == baseURL + urlID) {
    console.log("urls key " + urls[key]);
    isObj = false;
    answer = key;
    console.log("answer" + answer);
    return answer
  }
  
  console.log("nope");
} return answer;
}

function hasHTTP(x){
  var http = "http://";
  var https = "https://";
  console.log(x.substring(0, 7))
  console.log(x.substring(0, 8))
  if (x.substring(0, 7) != http && x.substring(0, 8) != https){
    
    x = http + x;
  }
  console.log("final x " + x);
  return x; 
}
function inSystem (url){
    if (urls.hasOwnProperty(url)){
      console.log("in");
      return urls;
    } else {
      console.log("not in");
      console.log(url);
      var shortened = baseURL + id;
      console.log(shortened);
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