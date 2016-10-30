const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Rules = mongoose.model('rules');
const OpenTime = mongoose.model('OpenTime');
const User = mongoose.model('User');
const ync = require('async');
const cors = require('cors');
const _ = require('lodash');



app.use(cors());

module.exports = function (app) {
  app.use('/', cors(), router);
};



router.post('/api/v1/update/', function (req, res, next) {
  OpenTime.findOne((err, result) => {
    return res.json({
      status: 'success',
      code: 200,
      msg: '操作成功!',
      data: result
    });
  });
});


router.get('/api/v1/getrules/tbh_hm', function (req, res, next) {
  Rules.find({types: 'tbh_hm'},
             {
               name: 1,
               num: 1,
               _id: 0
             },
             (err, result) => res.json({
               status: 'success',
               code: 200,
               msg: '操作成功!',
               data: result
             })
             );
});

// 特别号码 -> 号码

router.post('/api/v1/setrules/tbh_hm', function (req, res, next) {
  let list = [];
  _.forIn(req.body, function(value, key) {
    console.log(key,value);
    list.push({
      name: key,
      num: value,
      types: 'tbh_hm'
    });
  });


  Rules.remove({types:'tbh_hm'},(err, result) => {
    if (err) {
      return res.json({
        satus: false,
        code: 501,
      });
    }

    let task = [];
    for(var i = 0; i < list.length; i++) {
      let obj = new Rules(list[i]);
      task.push((cb) => obj.save((err, result) => cb(err, result)));
    }
    ync.parallel(task, (err, result) => {
      if (err) {
        return res.json({
          status: 'error',
          code: 500,
          msg: '操作失败!',
          des: err
        });
      }
      return res.json({
        status: 'success',
        code: 200,
        msg: '操作成功!',
        des: ''
      });

    });




  })


});
