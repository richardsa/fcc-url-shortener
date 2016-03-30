'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Counter= new Schema({
	counterVal: {type: String, required: true, default: 0}
});

module.exports = mongoose.model('Counter', Counter);
