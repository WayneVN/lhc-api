var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Referenceschema = new Schema({
  name: String,
  fsl: Number,
  bz: String,
  cou: Number //本期应得积分
});


mongoose.model('Reference', Referenceschema);
