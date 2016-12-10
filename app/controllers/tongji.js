const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Bet = mongoose.model('Bet');
const User = mongoose.model('User');
const ync = require('async');
const cors = require('cors');
const moment = require('moment');
const _ = require('lodash');
let jwt = require('jsonwebtoken');
const KEYS = 'cocodevn';
const request = require('superagent');
mongoose.set('debug', true);



app.use(cors());

module.exports = function(app) {
  app.use('/', cors(), router);

};


// 各种查询

router.get('/api/v1/tjfind', (req, res, next) => {
  Bet.find({},{},{
    sort: {
      createTime: -1
    }
  }, (err, result) => {
    return res.json({result})
  });
});

router.post('/api/v1/tjfind', (req, res, next) => {
  let {
    body: {
      begTime,
      endTime,
      qs = '',
      username = ''
    }
  } = req;
  let begT = begTime? new Date(begTime) : new Date('2001-01-01');
  let endT = endTime? new Date(endTime) : new Date('2020-11-11');

  Bet.find({
    createTime: {
      $gte: begT,
      $lte: endT
    },
    qs: {
      $regex: qs
    },
    username: {
      $regex: username
    }
  },{},{}, (err, result) => {
    console.log(err);
    return res.json({result})
  });
});
