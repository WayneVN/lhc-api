var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Zhifu = new Schema({
  zfb:String,
  wechart:String,
  yhk:String,
});


mongoose.model('Zhifu', Zhifu);
