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
const sscData = 'http://www.1680180.com/Open/CurrentOpen?code=10011';



app.use(cors());

module.exports = function (app) {
  app.use('/', cors(), router);
};

/* setInterval(()=>{
 *
 * }, 2000);*/



// 读取当期球码
router.get('/api/v2/getDataSsc', function (req, res, next) {
  request.get(sscData).end((err, r) => {
    return res.json({
      r: JSON.parse(r.text)
    })
  });
});
