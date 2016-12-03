// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var qsdata = new Schema({
  data: Object,
  lastList: Array
});

mongoose.model('qsdata', qsdata);
