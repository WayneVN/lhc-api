var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RulesSchema = new Schema({
  name: {
    type: String,
  },
  types: String,
  num: {
    type: Number,
    default: 0
  }
});

RulesSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('rules', RulesSchema);
