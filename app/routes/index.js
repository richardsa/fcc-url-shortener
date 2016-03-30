'use strict';

var path = process.cwd();

var UrlHandler = require(path + '/app/controllers/urlHandler.js');


module.exports = function(app, passport) {
var urlHandler = new UrlHandler();
  app.route('/')
    .get(function(req, res) {
      res.sendFile(path + '/public/index.html');
    });

  app.route('/:id')
  	.get(urlHandler.getFull)

  app.route('/new/:url(*)') // allow forward slashes in route: http://stackoverflow.com/a/24366031
  	.get(urlHandler.getShortened)
  	
  	app.route('/test/test')
  	.get(urlHandler.getDrop)
  
};
