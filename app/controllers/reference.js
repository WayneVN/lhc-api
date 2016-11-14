const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const ync = require('async');
const Reference = mongoose.model('Reference');

app.use(cors());

module.exports = function (app) {
  app.use('/', cors(), router);
};

// 添加代理
router.post('/api/v1/addReference', (req, res, next) => {
  let obj = new Reference(req.body);
  obj.save((err, result) => res.json({
    status: 'success',
    msg: '增加成功'
  }))
});

router.get('/api/v1/reference', (req, res, next) => {
  Reference.find({},(err, result) => res.json({
    status: 'success',
    data: result
  }))
});


router.get('/api/v1/re/dj/:uid', (req, res, next) => {
  let id = req.params.uid;
  Reference.remove({
    _id: id
  }, (err, result) => {
    return res.json(result);
  })
});

router.get('/api/v1/re/reset/:uid', (req, res, next) => {
  let id = req.params.uid;
  Reference.update({
    _id: id
  }, {
    $set: {
      cou: 0
    }
  }, (err, result) => {
    return res.json(result);
  })
});
