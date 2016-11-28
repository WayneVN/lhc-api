const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Bet = mongoose.model('Bet');
const OpenTime = mongoose.model('OpenTime');
const Zhifu = mongoose.model('Zhifu');
const Zz = mongoose.model('Zz');
const ync = require('async');
const cors = require('cors');
const moment = require('moment');
const Rules = mongoose.model('rules');
const EasyRules = require('../matching/easyRules');
const _ = require('lodash');
const api = '/api/v1/';

app.use(cors());

module.exports = function(app) {
  app.use('/', cors(), router);
};


// 保存支付信息
router.post(`${api}savezv`, (req, res, next) => {
  let {body} = req;
  Zhifu.remove((err,result) => {
    let obj = new Zhifu({
      zfb: body.zfb,
      yhk: body.yhk,
      wechart: body.wechart,
    });
    obj.save((err, result) => res.json({result}));
  })

});

router.get(`${api}zfb`, (req, res, next) => {
  Zhifu.findOne({}, (err, result) => res.json({result}));
});

router.post(`${api}savezz`, (req, res, next) => {
  let obj = new Zz({
    username: req.body.username,
    zh: req.body.zh,
    time: new Date(),
    status: false
  });
  User.update({
    username: req.body.username
  },{
    $set: {
      zh: req.body.zh
    }
  }, (err, result) => {
    console.log(result, '充值***');
  });

  obj.save((err, result) => res.json({result}));
});

router.get(`${api}czsq`, (req, res, next) => {
  Zz.find({},{},{
    sort:{ status: 1 }
  }, (err, result) => {
    return res.json({
      result: result,
      err: err
    })
  });
});

router.post(`${api}czsq`, (req, res, next) => {
  Zz.update({
    _id: req.body.id
  },{
    $set: {
      status: true
    }
  }, (err, result) => {
    return res.json({
      result: result,
      err: err
    })
  });
});
