const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const request = require('superagent');
const Article = mongoose.model('Article');
const OpenTime = mongoose.model('OpenTime');
const User = mongoose.model('User');
const cors = require('cors');
const ync = require('async');
const easyRules = require('../matching/easyRules');

let jwt = require('jsonwebtoken');
let colors = require("colors");

/* var token = jwt.sign({ name: '张三' }, 'shhhhh');
 *
 * let decoded = jwt.verify(token, 'shhhhh');*/
app.use(cors());

module.exports = function (app) {
  app.use('/', cors(), router);
};

router.get('/', function (req, res, next) {
  return res.render('index', {
    title: 'CC System'
  });
});

router.get('/admin', function (req, res, next) {
  return res.render('admin', {
    title: 'CC System'
  });
});



// 开盘时间
router.post('/api/v1/setOpenTime', function (req, res, next) {
  let obj = new OpenTime(req.body);
  OpenTime.remove({
    type: req.body.type
  },(err, result) =>{
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


router.get('/api/v1/getOpenTime/:type', function (req, res, next) {
  OpenTime.findOne({
    type: req.params.type
  },(err, result) => {
    return res.json({
      status: 'success',
      code: 200,
      msg: '操作成功!',
      data: result
    });
  });
});


router.post('/api/v1/accessToken', function (req, res, next) {
  if (req.body.state == 'codevn') {
    const p = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxc8495f6dcb8cc4cd&secret=cb3197d13fda519c448f315a9a3cbac0&code=${req.body.code}&grant_type=authorization_code `;
    request.get(p).end((err, result) => {
      let r = JSON.parse(result.text);
      console.log(r,'@@@@@@@@@@@@@@@@@');
      return res.json({
        r
      })
    });
  }
});
