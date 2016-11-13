var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'count is username?'],
    index: true,
    unique: true
  },
  pwd: {
    type: String,
    trim: true,
    required: [true, 'count is password?'],
    minlength: 6,
    maxlength: 20
  },
  cou: {
    type: Number,
    min: 0,
    required: [true, 'count is not?']
  },
  role: {
    type: String,
    enum: [
      'admin',
      'adminsub',
      'private',
      'vpn',
      'vip',
      'pig',
    ],
    default: 'pig',
    required: [true, 'user is level?']
  },
  fsl: {
    type: Number,
    required: [true, 'is not fs?'],
    default: 0
  },
  reference: {
    type: String,
    default: ''
  },
  imgkey: Number,
  createTime: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  bz: String,
  status: {
    type: Boolean,
    default: true
  }
});

UserSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('User', UserSchema);
