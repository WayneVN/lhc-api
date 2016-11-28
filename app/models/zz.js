var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
// 转账申请
var Zz = new Schema({
  username: String,
  zh:String,
  time: String,
  status: {
    type: Boolean,
    default: false
  }
});


mongoose.model('Zz', Zz);
