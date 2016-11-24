const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Qm = mongoose.model('Qm');
const User = mongoose.model('User');
const cors = require('cors');
const ync = require('async');
const easyRules = require('../matching/easyRules');
const m = require('moment');

app.use(cors());

module.exports = function (app) {
  app.use('/', cors(), router);
};


// 设置当期球码
router.post('/api/v1/setQm', function (req, res, next) {
  let {
    body: {
      qm,
      name,
      type,
      id
    }
  } = req;

  Qm.update({
    name: name,
    type: type
  }, {
    $set: {
      qm: qm,
      name: name,
      createTime: m(new Date()).format('x'),
    }
  }, {
    upsert: true,
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    return res.json({
      status: 'success',
      code: 200,
      msg: '操作成功!',
    });
  });
});

// 读取当期球码
router.get('/api/v1/getQm/:type', function (req, res, next) {

  Qm.findOne({
    type: type
  }, {
    name: 1,
    qm: 1
  }, {
    sort:{ createTime: -1 }
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    return res.json({
      status: 'success',
      code: 200,
      data: result
    });
  });
});
