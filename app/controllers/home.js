const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const OpenTime = mongoose.model('OpenTime');
const User = mongoose.model('User');
const cors = require('cors');
const ync = require('async');
const easyRules = require('../matching/easyRules');

let jwt = require('jsonwebtoken');
let colors = require("colors");

var token = jwt.sign({ name: '张三' }, 'shhhhh');

let decoded = jwt.verify(token, 'shhhhh');
app.use(cors());

module.exports = function (app) {
  app.use('/', cors(), router);
};

router.get('/', function (req, res, next) {
  let list = [13,15,16,12,25,22,44];
  /* let a  = easyRules.init(list);*/
  return res.json({
    status: true,
    code: 200,
    msg: 'success'
  });
});

// 开盘时间
router.post('/api/v1/setOpenTime', function (req, res, next) {
  let obj = new OpenTime(req.body);
  OpenTime.remove((err, result) =>{
    if (err) {
      return ;
    }
    obj.save((err,result) => {
      if (err) {
        return res.json({
          status: 'error',
          code: 501,
          msg: '操作失败!'
        });
      }
      return res.json({
        status: 'success',
        code: 200,
        msg: '操作成功!'
      });
    });
  });

});


router.get('/api/v1/getOpenTime', function (req, res, next) {
  OpenTime.findOne((err, result) => {
    return res.json({
      status: 'success',
      code: 200,
      msg: '操作成功!',
      data: result
    });
  });
});
