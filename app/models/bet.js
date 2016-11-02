var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BetSchema = new Schema({
  username: String,
  uid: String,
  createTime: {
    type: Date,
    default: Date.now
  },
  types: String,
  qm: String, // 球码
  xdpl: Number, //下单时赔率
  xdjf: Number, // 下注积分
  status: {
    type: Boolean,
    default: false
  }
});


mongoose.model('Bet', BetSchema);
