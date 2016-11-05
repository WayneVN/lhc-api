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
const api = '/api/v1/';

app.use(cors());

module.exports = function(app) {
  app.use('/', cors(), router);
};


// 普通用户记录
router.get(`${api}finduser`, (req, res, next) => {
  User.find({
    role: 'pig',
    status: true
  }, {
  }, {
   sort: {createTime: -1}
  }, (err, result) => res.json({result}));
});

router.get(`${api}findvpn`, (req, res, next) => {
  User.find({
    role: 'vpn'
  }, {
  }, {
   sort: {createTime: -1}
  }, (err, result) => res.json({result}));
});
