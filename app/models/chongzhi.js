var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChongzhiSchema = new Schema({
  createTime: {
    type: Date,
    default: Date.now
  },
  uname: String,
  price: String,
  zhanghu: String,
  type: Number, // 1充值，2提现
});

mongoose.model('Chongzhi', ChongzhiSchema);
