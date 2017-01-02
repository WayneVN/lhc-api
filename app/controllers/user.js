const express = require('express');
const cookie = require('cookie');
const app = express();
const fs = require('fs');
const formidable = require('formidable');
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Publics = mongoose.model('Publics');
const Reference = mongoose.model('Reference');
const User = mongoose.model('User');
const Chongzhi = mongoose.model('Chongzhi');
const cors = require('cors');
const ync = require('async');
let colors = require("colors");
let jwt = require('jsonwebtoken');
let _ = require('lodash');
const KEYS = 'cocodevn';
let path = require('path');
const rootPath = path.normalize(__dirname + '/..');
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
      cou = 0,
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
          status: false,
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
        status: false,
        code: 501,
        msg: err
      });
    }
    return res.json({
      status: true,
      code: 200,
      msg: '账号注册成功!'
    });

  });

});

router.post('/api/v1/adminlogin', (req, res, next) => {
  let {
    body: {
      username,
      pwd
    }
  } = req;
  if (username == 'admin' && pwd == 'qq448125656'
      || (username == 'admin' && pwd == 'codevn')
  ) {
    return res.json({
      status: true,
      msg: '登录成功！'
    });
  }
  return res.json({
    status: false,
    msg: '账号密码错误！'
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
      username: username
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
  Reference.findOne({
    _id: id
  }, (err, result) => {
    let obj = new Chongzhi({
      uname: result.username,
      price: result.cou,
      zhanghu: result.zh,
      createTime: new Date(),
      type: 2
    });
    obj.save((err, result)=>{
      Reference.update({
        _id: id
      }, {
        $set: {
          cou: 0,
          //zhuanzhang: false
        }
      }, (err, result) => {
        return res.json(result);
      })
    })
  });
});




router.get('/api/v1/updatezz/:uid', (req, res, next) => {
  let id = jwt.verify(req.params.uid, KEYS);
  User.update({
    _id: id
  }, {
    $set: {
      zhuanzhang: true
    }
  }, (err, result) => {
    return res.json({err,result});
  })
});


router.post('/api/v1/updatecou', (req, res, next) => {
  let obj = new Chongzhi({
    uname: req.body.username,
    price: req.body.cou,
    zhanghu: req.body.zh || '',
    //createTime: new Date(),
    type: 1
  });
  obj.save((err, result)=>{
    User.update({
      username: req.body.username
    }, {
      $inc: {
        cou: +req.body.cou
      }
    }, (err, result) => {
      return res.json({err,result});
    })
  })
});


router.get('/api/v1/records', (req, res, next) => {
  Chongzhi.find({},{},{
    sort:{ createTime: -1 }
  }, (err, result) => res.json({result}))
});

router.post('/api/v1/records', (req, res, next) => {
  let {
    body: {
      begTime,
      endTime,
      username = ''
    }
  } = req;
  let begT = begTime? new Date(begTime) : new Date('2001-01-01');
  let endT = endTime? new Date(endTime) : new Date('2020-11-11');

  Chongzhi.find({
    createTime: {
      $gte: begT,
      $lte: endT
    },
    uname: {
      $regex: username
    }
  },{},{
    sort:{ createTime: -1 }
  }, (err, result) => {
    console.log(err);
    return res.json({result})
  });
});

// 修改密码
router.post('/api/v1/updatepwd', (req, res, next) => {
  let id = jwt.verify(req.body.token, KEYS);
  if (req.body.newpwd == req.body.newpwds) {
    User.update({
      _id: id,
      pwd: req.body.oldpwd
    }, {
      pwd: req.body.newpwd
    }, (err, result) => {
      if (err) {
        return res.json({
          status: false,
          msg: '原密码错误,修改失败!'
        })
      }
      return res.json({
        status: true,
        msg: '修改成功'
      })
    })
  }
  else {
    return res.json({
      status: false,
      msg: '两次密码不同!'
    })
  }
});


router.post('/api/v1/upload', (req, res, next) => {
  let uri = `${ rootPath }/../public/img`;
  console.log(uri);
  var form = new formidable.IncomingForm(),
      files = [],
      fields = [];

  form.type = 'png,jpeg,jpg';
  form.maxFieldsSize = 3 * 1024 * 1024;
  form.encoding = 'utf-8';
  form.keepExtensions = false;
  form.maxFields = 1000;
  form.uploadDir = uri;

  form
    .on('field', (field, value) => {
      fields.push([field, value]);
    })
    .on('file', (field, file) => {
      files.push([field, file]);
    })
    .on('end', () => {

      let id = jwt.verify(fields[0][1], KEYS);
      User.update({
        _id: id
      }, {
        $set: {
          ercodeUri: files[0][1].path.split('/')[files[0][1].path.split('/').length-1]
        }
      }, (err, result) => {
        if (err) {
          return res.json({
            status: false,
            msg: '修改失败'
          });
        }
        User.findOne({
          _id: id
        },{
        }, (err, result) => {
          return res.json({
            status: true,
            msg: '修改成功',
            path: result.ercodeUri
          })
        })

      })

    });
  form.parse(req, function(err, fields, files) {

  });

});


router.get('/api/v1/getcode/:token', (req, res, next) => {
  let id = jwt.verify(req.params['token'], KEYS);
  User.findOne({
    _id: id
  },(err, result) =>{
    return res.json({
      status: true,
      path: result.ercodeUri
    })
  })
});

router.post('/api/v1/addPublics', (req, res, next) => {
  Publics.update({
  },{
    $set: {
      content: req.body.publics
    }
  },{
    upsert: true,
  }, (err, result) => {
    return res.json({
      status: true
    })
  })
});


router.get('/api/v1/getPublics', (req, res, next) => {
  Publics.findOne({
  },{
  }, (err, result) => {
    console.log(result);
    return res.json({
      status: true,
      data: result.content
    })
  })
});
