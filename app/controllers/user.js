const express = require('express');
const cookie = require('cookie');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const cors = require('cors');
const ync = require('async');
let colors = require("colors");
let jwt = require('jsonwebtoken');
let _ = require('lodash');
const KEYS = 'cocodevn';
const COOKIECONFIG =  {
  maxAge: 900000,
  httpOnly: true
};

app.use(cors());

module.exports = function(app) {
  app.use('/', router);
};

router.post('/api/v1/signup', (req, res, next) => {
  let {
    body: {
      username,
      pwd,
      role = 'pig',
      cou,
      fsl = 0,
      reference,
      bz = ''
    }
  } = req;

  var obj = new User({
    username,
    pwd,
    cou,
    role,
    bz,
    reference,
    fsl
  });

  let task = [
    function(cb) {
      User.findOne({
        username
      }, (err, user) => {
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

router.post('/api/v1/login', (req, res, next) => {
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
  obj.status = true;

  if (!username || !pwd) {
    return res.json({
      status: false,
      msg: '账号密码不可为空！'
    });
  }
  if (!(username.length > 5 && username.length < 20) ||
    !(pwd.length > 5 && pwd.length < 20)
  ) {
    return res.json({
      status: false,
      msg: '账号密码长度非法！',
    });
  }

  User.findOne(obj, {
    username: 1,
    _id: 1,
  }, (err, user) => {
    if (err || !user) {
      return res.json({
        status: false,
        msg: '账号密码错误,请联系管理员！'
      });
    }
    let token = jwt.sign({ _id: user._id }, KEYS);
    return res.json({
      status: true,
      code: 200,
      token: token,
      username: userpname
    });

  });
});

router.get('/api/v1/getUserinfo/:uid', (req, res, next) => {
  if (req.params.uid) {
    let uid = jwt.verify(req.params.uid, KEYS);
    User.findOne({
      _id: uid
    }, {
      pwd: 0
    }, (err, result) => {
      if (!_.isEmpty(result)) {
        return res.json({
          status: 'success',
          code: 200,
          msg: '',
          data: result
        });
      } else {
        return res.json({
          status: 'error',
          code: 401,
          msg: '尚未登录，请登录!'
        });
      }
    });

  } else {
    return res.json({
      status: 'error',
      code: 401,
      msg: '尚未登录，请登录!'
    });
  }

});

router.get('/api/v1/getCou/:uid', (req, res, next) => {
  User.findOne({
    _id: jwt.verify(req.params.uid, KEYS),
  }, {
    cou: 1,
    _id: 0
  }, (err, result) => {
    return res.json(result);
  })
});


router.get('/api/v1/dj/:uid', (req, res, next) => {
  let id = req.params.uid;
  User.update({
    _id: id
  }, {
    $set: {
      status: false
    }
  }, (err, result) => {
    return res.json(result);
  })
});

router.get('/api/v1/reset/:uid', (req, res, next) => {
  let id = req.params.uid;
  User.update({
    _id: id
  }, {
    $set: {
      cou: 0
    }
  }, (err, result) => {
    return res.json(result);
  })
});
