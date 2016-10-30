const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Rules = mongoose.model('rules');
const cors = require('cors');
const ync = require('async');
const _ = require('lodash');


app.use(cors());

module.exports = function (app) {
  app.use('/', router);
};

router.get('/initrules/savelist', function (req, res, next) {
  lm4();
  lm3();
  lm32();
  lm33();
  lm2();
  lm3();
  lm_zt();
  lm_z2();
  tc();
  sxl();
  wsl();
  qbz();
});


/*   连码=> 四全中 */
function lm4() {
  let obj  = new Rules({
    name: '4qz',
    types: 'lm',
    num: 1000
  });
  obj.save((err, result) => {
    console.log(err, result, '四全中');
  });
}

/*   连码=> 三全中 */
function lm3() {
  let obj  = new Rules({
    name: '3qz',
    types: 'lm',
    num: 650
  });
  obj.save((err, result) => {
    console.log(err, result, '三全中');
  });
}

/*   连码=> 三中二 */
function lm32() {
  let obj  = new Rules({
    name: '3z2',
    types: 'lm',
    num: 20
  });
  obj.save((err, result) => {
    console.log(err, result, '中二');
  });
}

/*   连码=> 三中三 */
function lm33() {
  let obj  = new Rules({
    name: '3z3',
    types: 'lm',
    num: 100
  });
  obj.save((err, result) => {
    console.log(err, result, '中三');
  });
}

/*   连码=> 中二 */
function lm2() {
  let obj  = new Rules({
    name: '2qz',
    types: 'lm',
    num: 63
  });
  obj.save((err, result) => {
    console.log(err, result, '二全中');
  });
}

/*   连码=> 二中特 */
function lm_zt() {
  let obj  = new Rules({
    name: 'zt',
    types: 'lm',
    num: 31
  });
  obj.save((err, result) => {
    console.log(err, result, ' 二中特->中特');
  });
}

/*   连码=> 二中特 */
function lm_z2() {
  let obj  = new Rules({
    name: 'z2',
    types: 'lm',
    num: 50
  });
  obj.save((err, result) => {
    console.log(err, result, ' 二中特->中二');
  });
}

/*   连码=> 特串 */
function tc() {
  let obj  = new Rules({
    name: 'tc',
    types: 'lm',
    num: 155
  });
  obj.save((err, result) => {
    console.log(err, result, '特串');
  });
}

/*  生肖连 => 2~5连 */
function sxl() {
  for(var j = 2; j <= 5; i++) {
    for(var i = 1; i <= 12; i++) {
      let obj  = new Rules({
        name: `${ j }l${ i }`,
        types: 'sxl',
        num: 0
      });
    }
    obj.save((err, result) => {
      console.log(err, result, '二连');
    });
  }

}

/* 尾数连*/
function wsl() {
  for(var j = 2; j <= 5; i++) {
    for(var i = 0; i <= 9; i++) {
      let obj  = new Rules({
        name: `${ j }l${ i }`,
        types: 'wsl',
        num: 0
      });
    }
    obj.save((err, result) => {
      console.log(err, result, '二连');
    });
  }

}

/* 全不中*/
function qbz() {
  for(var j = 5; j <= 12; i++) {
    for(var i = 1; i <= 49; i++) {
      let obj  = new Rules({
        name: `${ j }l${ i }`,
        types: 'wsl',
        num: 0
      });
    }
    obj.save((err, result) => {
      console.log(err, result, '全不中');
    });
  }

}
