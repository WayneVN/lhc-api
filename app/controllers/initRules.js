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

router.get('/initrules/save', function (req, res, next) {
  tbh_hm();
  /* tbh_lm();
   * tbh_bs();
   * tbh_ws()
   * zmt_zm();
   * zmt_bs();
   * zmt_lm();
   * zm_hm();
   * zm_bs();
   * sums();
   * sx();
   * ws();
   * hx();*/
});

// 特别号=>号码
function tbh_hm() {
  for(var i = 1; i <= 49; i++) {
    let obj  = new Rules({
      name: `tb${ i }`,
      types: 'tbh_hm',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '特别号=>号码');
    });
  }
}

// 特别号-》两面
function tbh_lm() {
  /* 特大
     特小
     特单
     特双
     尾大
     合大
     合小
     合单
     合双
     尾小	*/
  let list = [
    'td',
    'tx',
    'tdan',
    'ts',
    'wd',
    'hx',
    'hd',
    'hd',
    'hs',
    'wx',
    'h'
  ];

  for(var i = 0; i < list.length; i++) {
    let obj  = new Rules({
      name: list[i],
      types: 'tbh_lm',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '特别号=>号码');
    });
  }
}

// 特别号 => 波色
function tbh_bs() {
  let list = [
    'red',
    'blue',
    'green',
  ];

  for(var i = 0; i < list.length; i++) {
    let obj  = new Rules({
      name: list[i],
      types: 'tbh_bs',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '特别号 => 波色');
    });
  }
}

// 特别号 =>  生肖
function tbh_sx() {
  /* 鼠
   * 牛
   * 虎
   * 兔
   * 龙
   * 蛇
   * 马
   * 羊
   * 猴
   * 鸡
   * 狗
   * 猪*/


  for(var i = 1; i <= 12; i++) {
    let obj  = new Rules({
      name: list[i],
      types: 'tbh_sx',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '生肖');
    });
  }
}

// 特别号 =>  尾数
function tbh_ws() {

  for(var i = 0; i <= 9; i++) {
    let obj  = new Rules({
      name: list[i],
      types: 'tbh_ws',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '尾数');
    });
  }
}

// 正码特 => 正码1~6
function zmt_zm() {
  for(var i = 1; i <= 6; i++) {
    for(var j = 1; j <= 49; j++) {
      let obj  = new Rules({
        name: `zm_${i}_${j}`,
        types: 'zmt_zm',
        num: 0
      });
    obj.save((err, result) => {
      console.log(err, result, '正码1~6');
    });
    }
  }
}

// 正码特 => 波色
function zmt_bs() {
  let map = {
    0: 'red',
    1: 'blue',
    2: 'green'
  }
  for(var i = 1; i <= 6; i++) {
    for(var j = 0; j < map.length; j++) {
      let obj  = new Rules({
        name: `bs_${i}_${map[j]}`,
        types: 'zmt_bs',
        num: 0
      });
      obj.save((err, result) => {
        console.log(err, result, ' 正码特 => 波色');
      });
    }
  }
}

// 正码特 => 两面
function zmt_lm() {
  let list = [
    'td',
    'tx',
    'td',
    'tx',
    'wd',
    'hx',
    'hd',
    'hd',
    'hs',
    'wx'
  ];

  for(var i = 1; i <= 6; i++) {
    for(var j = 0; j < list.length; j++) {
      let obj  = new Rules({
        name: `lm_${i}_${list[j]}`,
        types: 'zmt_lm',
        num: 0
      });
      obj.save((err, result) => {
        console.log(err, result,'正码特 => 两面');
      });
    }
  }
}

// 正码-》号码
function zm_hm() {
  for(var i = 1; i <= 49; i++) {
    let obj  = new Rules({
      name: `${ i }`,
      types: 'zm_hm',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '正码=>号码');
    });
  }
}

// 正码 => 过关=>波色
function zm_bs() {
  let list = [
    'red',
    'blue',
    'green',
  ];

  for(var i = 0; i < list.length; i++) {
    let obj  = new Rules({
      name: list[i],
      types: 'zm_bs',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '正码 => 波色');
    });
  }
}

// 正码 => 过关两面
function zm_bs() {
  let list = [
    'td',
    'tx',
    'td',
    'tx',
    'wd',
    'hx',
    'hd',
    'hd',
    'hs',
    'wx'
  ];

  for(var i = 0; i < list.length; i++) {
    let obj  = new Rules({
      name: list[i],
      types: 'zm_lm',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '正码 => 两面');
    });
  }
}

// 总和
function sums() {
  let list = [
    'da',
    'xiao',
    'dan', // 单
    'shuang'// 双
  ]
  for(var i = 0; i < list.length; i++) {
    let obj  = new Rules({
      name: list[i],
      types: 'sums',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '总和');
    });
  }

}

// 一肖
function sx() {
  for(var i = 1; i <= 12; i++) {
    let obj  = new Rules({
      name: i,
      types: 'sx',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '生效');
    });
  }
}

// 尾数
function ws() {
  for(var i = 1; i <= 9; i++) {
    let obj  = new Rules({
      name: i,
      types: 'ws',
      num: 0
    });
    obj.save((err, result) => {
      console.log(err, result, '尾数');
    });
  }
}

// 合肖
function hx() {
  let list = [
    "5.5",
    "3.6",
    "2.7",
    "2.1",
    "1.86",
    "1.53",
    "1.33",
    "1.17",
    "1.04",
    "0.95",
  ];

  for(var i = 1; i <= list.length; i++) {
    let obj  = new Rules({
      name: i,
      types: 'hx',
      num: +list[i]
    });
    obj.save((err, result) => {
      console.log(err, result, '生效');
    });
  }
}
