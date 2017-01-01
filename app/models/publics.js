var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PublicsSchema = new Schema({
  content: {
    default: '暂无公告',
    type: String
  }
});

mongoose.model('Publics', PublicsSchema);
