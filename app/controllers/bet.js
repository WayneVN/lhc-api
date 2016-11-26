const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Bet = mongoose.model('Bet');
const OpenTime = mongoose.model('OpenTime');
const User = mongoose.model('User');
const ync = require('async');
const cors = require('cors');
const moment = require('moment');
const Rules = mongoose.model('rules');
const Qm = mongoose.model('Qm');
const EasyRules = require('../matching/easyRules');
const Ssc = require('../matching/ssc');
const _ = require('lodash');
let jwt = require('jsonwebtoken');
const KEYS = 'cocodevn';
const request = require('superagent');
const sscData = 'http://www.1680180.com/Open/CurrentOpen?code=10011';


app.use(cors());

module.exports = function(app) {
  app.use('/', cors(), router);

};

// 下注
router.post('/api/v1/betplay', function(req, res, next) {
  let {
    body
  } = req;

  // 查找当前赔率 => 扣除积分 => 下单
  findPl(body, next, num => {

    OpenTime.findOne((err, result) => {
      let {
        openDate,
        openTime,
        closeTime,
        closeDate
      } = result;
      let t = Date.parse(new Date());
      if (body.types == 'dwt') {
        let a = moment();
        if (a.hours()>=2 && a.hours()<8) {
          return res.json({
            status: 'error',
            code: 500,
            msg: '当前为封盘时间!',
          });
        }
      }
      else {
        if (t>closeTime || t< openTime) {
          return res.json({
            status: 'error',
            code: 500,
            msg: '当前为封盘时间!',
          });
        }
      }


      let obj = {
        username: body.username || '测试1',
        uid: jwt.verify(body.uid, KEYS),
        createTime: new Date(),

        types: body.types,
        qm: (() => {
          if (body.types == 'qbz') {
            return _.last(body.qm.split('_'));
          }
          if (body.types == 'hx') {
            return `hx_${_.last(body.qm.split('_'))}`;
          }
          if (body.types == 'wsl') {
            return `wsl_${_.last(body.qm.split('_'))}`;
          }
          if (body.types == 'sxl') {
            return `sxl_${_.last(body.qm.split('_'))}`;
          }
          return body.qm;
        })(), // 球码
        qms: (() => {
          if (
            body.types == 'qbz' ||
            body.types == 'hx' ||
            body.types == 'wsl' ||
            body.types == 'sxl'
          ) {
            let a = body.qm.split('_');
            let list = [];
            for(var i = 0; i < a.length-1; i++) {
              list.push(a[i]);
            }
            return list;
          }
          return [];
        })(),
        xdpl: num, //下单时赔率
        xdjf: body.xdjf, // 下注积分
      };

      // 扣除积分
      kouqian(jwt.verify(body.uid, KEYS), body.xdjf, (err, result) => {
        new Bet(obj).save((err, result) => {
          if (err) {
            return next(err);
          }
          return res.json({
            status: 'success',
            code: 200,
            msg: '下单成功!',
          });
        });
      });


    });

  });

});

// 结算
router.post('/api/v1/reckoning', (req, res, next) => {
  Bet.find({
    status: false
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    let list = _.groupBy(result, 'uid');
    Qm.findOne({}, {
      name: 1,
      qm: 1
    }, {
      sort:{ createTime: -1 }
    }, (err, result) => {
      if (err) {
        return next(err);
      }

      _.forIn(list, (v, k) => {
        EasyRules.init(k, v, result.qm);
      });

      return res.json({
        list
      })
    });

  })

});

// 查看单个下单记录
router.get('/api/v1/getBet/:uid', (req, res, next) => {
  let uid = jwt.verify(req.params.uid, KEYS);
  Bet.find({
    uid: uid._id
  }, {}, {
    sort:{ createTime: -1 }
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    return res.json({
      status: true,
      data: result
    })
n  })
});

router.get('/api/v1/getUserBet/:uid', (req, res, next) => {
  Bet.find({
    uid: req.params.uid
  }, {}, {
    sort:{ createTime: -1 }
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    return res.json({
      status: true,
      data: result
    })
  })
});

/* 查找赔率*/
function findPl(body, next, cb) {
  let {types, qm} = body;
  if (types == 'qbz') {
    qm = _.last(qm.split('_'));
  }
  if (types == 'hx') {
    qm = `hx_${_.last(body.qm.split('_'))}`;
  }
  if (types == 'wsl') {
    qm = `wsl_${_.last(body.qm.split('_'))}`;
  }
  if (types == 'sxl') {
    qm = `${_.last(body.qm.split('_'))}`;
  }
  if (types == 'lmt') {
    qm = `lmt_${qm.length}`;
  }

  Rules.findOne({
    name: qm,
    types: types
  }, {
    num: 1
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    return cb(result.num);
  });
}

/* 扣除积分 */
function kouqian(id, jf, cb) {
  User.update({
    _id: id,
    cou: {
      $gt: jf
    }
  }, {
    $inc: {
      cou: -jf
    }
  }, (err, result) => {
    console.log(result, '扣除积分');
    if (err) {
      return res.json({
        status: 'error',
        code: 501,
        msg: err
      });
    }
    return cb(err, result);
  });
}






router.post('/api/v1/betssc', function(req, res, next) {
  let {
    body
  } = req;
  let a = moment();
  if (a.hours()>=2 && a.hours()<8) {
    return res.json({
      status: 'error',
      code: 500,
      msg: '当前为封盘时间!',
    });
  }

  request.get(sscData).end((err, result) => {
    let r = JSON.parse(result.text);
    let a = new Date(r.n_d).getTime()/1000;
    let now = new Date().getTime()/1000;
    let diff = parseInt(a-now);
    if (diff <= 90) {
      return res.json({
        status: 'error',
        code: 500,
        msg: '开奖前90秒不可下单!',
      })
    }
    else {
      // 查找当前赔率 => 扣除积分 => 下单
      jz(body,res,next);
    }
  });

});

function jz(body, res, next) {
  findPl(body, next, num => {

    let obj = {
      username: body.username || '',
      uid: jwt.verify(body.uid, KEYS),
      createTime: new Date(),
      qs: body.qs,
      types: body.types,
      qm: body.qm,
      xdpl: num, //下单时赔率
      xdjf: body.xdjf, // 下注积分
    };

    // 扣除积分
    kouqian(jwt.verify(body.uid, KEYS), body.xdjf, (err, result) => {
      new Bet(obj).save((err, result) => {
        if (err) {
          return next(err);
        }
        return res.json({
          status: 'success',
          code: 200,
          msg: '下单成功!',
        });
      });
    });



  });
}

//自动结算
function autoCount() {
  Bet.find({
    status: false
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    let list = _.groupBy(result, 'uid');
    Qm.findOne({}, {
      name: 1,
      qm: 1
    }, {
      sort:{ createTime: -1 }
    }, (err, result) => {
      if (err) {
        return next(err);
      }

      _.forIn(list, (v, k) => {
        Ssc.init(k, v, result.qm);
      });

      /* return res.json({
       *   list
       * })*/
    });

  })


}
setInterval(()=> {
  autoCount();
}, 5000 * 3);
