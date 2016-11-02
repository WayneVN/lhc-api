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
const EasyRules = require('../matching/easyRules');
const _ = require('lodash');

app.use(cors());

module.exports = function(app) {
  app.use('/', cors(), router);

};

// 下注
router.post('/api/v1/betplay', function(req, res, next) {
  let {
    body
  } = req;

  findPl(body, next, num => {

    OpenTime.findOne((err, result) => {
      let {
        openDate,
        openTime,
        closeTime,
        closeDate
      } = result;

      let obj = {
        username: body.username,
        uid: body.uid,
        createTime: new Date(),
        types: body.types,
        qm: body.qm, // 球码
        xdpl: num, //下单时赔率
        xdjf: body.xdjf, // 下注积分
      };

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

// 结算
router.post('/api/v1/reckoning', (req, res, next) => {
  Bet.find({
    status: false
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    let list = _.groupBy(result, 'uid');
    let dbTask = [];
    _.forIn(list, (v, k) => {
      EasyRules.init(k, v);
    });

    return res.json({
       list
    })
  })

});

/* 查找赔率*/
function findPl(body, next, cb) {
  let {types, qm} = body;

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
