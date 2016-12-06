var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Zhifu = new Schema({
  zfb:String,
  wechart:String,
  yhk:String,
  je: String,
  type: Number
});


mongoose.model('Zhifu', Zhifu);
