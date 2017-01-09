var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Tz = new Schema({
  num: Number,
  min: {
    type: Number,
    default: 0
  }
});

mongoose.model('Tz', Tz);
