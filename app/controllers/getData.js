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
const request = require('superagent');
//const sscData = 'http://baidu.lecai.com/lottery/ajax_current.php?lottery_type=200';
const sscData = 'http://baidu.lecai.com/lottery/ajax_latestdrawn.php?lottery_type=200';
const Qsdata = mongoose.model('qsdata');



app.use(cors());

module.exports = function (app) {
  app.use('/', cors(), router);
};

setInterval(()=>{
  diffRemoteData(result => {
    console.log( '**************定时器***************');
  });
}, 5000);


router.get('/api/v1/getDataSsc', function (req, res, next) {
  const path = 'http://www.1680180.com/Open/CurrentOpen?code=10011';
  request.get(path).end((err, result) => {
    let r = JSON.parse(result.text);
    return res.json({
      r
    })
  });
});

// 读取当期球码
router.get('/api/v2/getDataSsc', function (req, res, next) {
  Qsdata.findOne({},{}, (err, result) => {
    return res.json({
      result: result.lastList
    })
  });
});




// 对比数据差异
function diffRemoteData(cb) {
  /*   lastList*/
  Qsdata.findOne({},{}, (err, result) => {
    if (!result.lastList.length) {
      saveRemoteData(() => {
        console.log('入库完成 51', '**************log***************');
      });
    }
    let openTime = result.lastList[1].time_endsale_syndicate_fixed;
    openTime = m(openTime).format('X');
    let nowTime = m(new Date()).format('X');
    if (openTime< nowTime) {
      console.log('抓数据', '**************log***************');
      saveRemoteData(() => {
        console.log('入库完成 60', '**************log***************');
      });
    }
    else {
      console.log('没变化,读取数据库', '**************log***************');
    }
    return cb(result);
  });
}


// 获取远程数据
function getRemoteData(cb) {
  request.get(sscData)
         .set('Referer', 'http://baidu.lecai.com/lottery/draw/view/200?agentId=5555')
         .set('Accept', 'application/json, text/javascript, */*; q=0.01')
         .set('Accept-Encoding', 'gzip, deflate, sdch')
         .set('Accept-Language', 'zh-CN,zh;q=0.8,en;q=0.6')
         .set('Host', 'baidu.lecai.com')
         .set('X-Requested-With', 'XMLHttpRequest')
         .set('Pragma', 'no-cache')
         .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36')
         .end((err, r) => {
           return cb(JSON.parse(r.text).data);
         });
}

//入库
function saveRemoteData(cb) {
  getRemoteData(obj => {
    Qsdata.update({},{
      $set: {
        lastList: obj
      }
    }, {
      upsert: true,
    },(err, result) => {
      console.log('抓百度成功...(setDB)');
      return cb();
    });
  })
}
