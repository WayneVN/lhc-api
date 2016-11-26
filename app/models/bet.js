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
  qs: String,
  qm: String, // 球码
  qms: Array,
  reference: String, //推荐人id
  xdpl: Number, //下单时赔率
  xdjf: Number, // 下注积分
  isfs: {       // 是否已经返还积分
    type: Boolean,
    default: false
  },
  status: {
    type: Boolean,
    default: false
  }
});


mongoose.model('Bet', BetSchema);
