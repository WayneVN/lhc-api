const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const OpenTime = mongoose.model('OpenTime');
const User = mongoose.model('User');
const ync = require('async');
const cors = require('cors');



app.use(cors());

module.exports = function (app) {
  app.use('/', cors(), router);
};



router.get('/api/v1/betplay', function (req, res, next) {
  OpenTime.findOne((err, result) => {
    return res.json({
      status: 'success',
      code: 200,
      msg: '操作成功!',
      data: result
    });
  });
});
