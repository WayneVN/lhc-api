var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Tz = new Schema({
  num: Number
});

mongoose.model('Tz', Tz);
