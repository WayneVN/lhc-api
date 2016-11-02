var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var QmSchema = new Schema({
  id: Schema.Types.ObjectId,
  qm: {
    type: Array,
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    index: true,
    unique: true
  }
});


mongoose.model('Qm', QmSchema);
