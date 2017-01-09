const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Rules = mongoose.model('rules');
const Tz = mongoose.model('Tz');
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


// 读取规则
router.get('/api/v1/getrules/:type', function (req, res, next) {
  Rules.find({types: req.params.type},
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


//更新规则
router.post('/api/v1/setrules/:type', function (req, res, next) {
  let list = [];
  _.forIn(req.body, function(value, key) {
    list.push({
      name: key,
      num: value,
      types: req.params.type
    });
  });


  Rules.remove({types:req.params.type},(err, result) => {
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


router.get('/api/v1/gettz', (req, res, next) => {
  Tz.findOne({
  }, (err, result) => {
    return res.json({
      status: true,
      data: result,
    })
  })
});

router.post('/api/v1/savetz', (req, res, next) => {
  let obj = new Tz({
    num: +req.body.num,
    min: +req.body.min
  });
  Tz.remove({}, (e,r) =>{
    obj.save((err, result) => {
      return res.json({
        status: true,
        msg: '修改成功',
        des: `上限修改为${ req.body.num },下限为${ req.body.min }`
      })
    });
  });

});
