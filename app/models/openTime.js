var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var OpenTimeSchema = new Schema({
  openTime: String,
  openDate: String,
  closeTime: String,
  closeDate: String
});

OpenTimeSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('OpenTime', OpenTimeSchema);
