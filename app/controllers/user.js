const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const cors = require('cors');
const ync = require('async');
let colors = require("colors");
let jwt = require('jsonwebtoken');

app.use(cors());

module.exports = function (app) {
  app.use('/', router);
};


router.post('/api/v1/signup', (req, res, next) => {
  let {
    body: {
      username,
      pwd,
      role,
      cou,
      bz = ''
    }
  } = req;

  var obj = new User({
    username,
    pwd,
    cou,
    role,
    bz
  });

  let task = [
    function(cb) {
      User.findOne({username}, (err, user) =>{
        return cb(err, user);
      });
    },
    function(result, cb) {
      if (result && result._id) {
        return res.json({
          status: 'error',
          msg: '账号已注册!'
        });
      }
      if (!result) {
        obj.save((err, result) => {
          return cb(err, true);
        });
      }
    }
  ];
  ync.waterfall(task, (err, result) => {
    if (err) {
      return res.json({
        status: 'error',
        code: 501,
        msg: err
      });
    }
    return res.json({
      status: 'success',
      code: 200,
      msg: '账号注册成功!'
    });

  });

});

router.post('/login', (req, res, next) => {
  let {
    body: {
      username,
      pwd
    }
  } = req;
  let obj = {
    username,
    pwd
  };

  if (!username || !pwd) {
    return res.json({
      status: false,
      msg: '账号密码不可为空！'
    });
  }
  if (!(username.length>5 && username.length<20 )||
      !(pwd.length>5 && pwd.length<20 )
  ) {
    return res.json({
      status: false,
      msg: '账号密码长度非法！',
    });
  }

  User.findOne(obj, {username:1, _id:1}, (err, user) =>{
    if (err) {
      return res.json({
        status: false,
        msg: '账号密码错误！'
      });
    }
    req.session.user = {
      _id: jwt.sign({ _id: user._id }, 'cocodevn')
    };
    req.session.save(err => res.json({status: true, msg: err}));
    return res.json({
      status: true,
      data: {
        uid: req.session.user
      }
    });
  });
});
