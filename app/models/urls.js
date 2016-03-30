'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Urls = new Schema({

    originalURL: {type: String, required: true},
    shortURL: {type: String, required: true},
	
	
});

module.exports = mongoose.model('Urls', Urls);
