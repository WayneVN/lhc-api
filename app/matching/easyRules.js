const mongoose = require('mongoose');
const ync = require('async');
const _ = require('lodash');
const User = mongoose.model('User');
const Reference = mongoose.model('Reference');
const Bet = mongoose.model('Bet');
const Maps = require('./maps');

let match = {
  init(k, v, cb) {
    this.curNum = [11,13,14,15,16,12,1]; //nums; //当期开奖号码
    this.sumPrice = []; // 总金额
    this.uid = k;

    // 查找对应规则 db中types名称为函数名
    for(let i = 0; i < v.length; i++) {
      this[v[i].types](v[i]);
    }
    this.fs(); //先反水再结算
  },

  // 计算结果入库
  setDb() {
    let sums = _.sum(this.sumPrice);
    User.update({
      _id: this.uid
    }, {
      $inc: {
        cou: sums
      }
    }, (err, result) => {
      if (!err) {
        this.updateStatus();
      }
    });
  },

  // 更改订单状态
  updateStatus() {
    Bet.update({
      uid: this.uid,
      status: false
    }, {
      $set: {
        status: true,
        isfs: true
      }
    }, {
      multi: true
    },(err,result) => {
      console.log(result,err, '更改状态',this.uid);
    })
  },

  fs() {
    Bet.find({
      uid: this.uid,
      status: false
    },(err, result) => {
      let sums = _.sumBy(result, 'xdjf');
      User.findOne({
        _id: this.uid
      }, (err, result) => {
        let a = result.fsl;
        this.sumPrice.push(sums*(a/100));
        this.setDb();
        this.vpn(sums);
      })
    });
  },

  // 代理反水
  vpn(sums) {
    User.findOne({
      _id: this.uid
    }, (err, result) => {
      let id = result.reference;
      if (id) {
        Reference.findOne({
          _id: id
        }, (err, result) => {
          let a = result.fsl/100;
          Reference.update({
            _id: id
          }, {
            $inc: {
              cou: sums*a
            }
          }, (err, result) => {
            console.log(err, result, '代理反水');
          })
        })
      }
    });
  },

  // 计算应得积分
  countPrice(pl, jf) {
    let sum = pl * jf;
    this.sumPrice.push(sum);
  },

  // 特别号=>号码
  tbh_hm(v) {
    let tbh = _.last(this.curNum);
    if (_.replace(v.qm, 'tb', '') == tbh) {
      this.countPrice(v.xdpl, v.xdjf);
    }
    else {
      this.countPrice(0, 0);
    }
  },

  // 特别号=>两面
  tbh_lm(v) {
    let userNum = _.last(this.curNum); // 特别号码
    let hs = userNum.toString().split('');
    let result = [];
    if (userNum == 49) {
      this.countPrice(1, v.xdjf);
    }
    else {
      if (userNum >= 25) {
        result.push('teda'); //特大
      }
      if (userNum <= 24) {
        result.push('texiao'); //特小
      }
      if ( (userNum%2) == 0) {
        result.push('teshuang') // 特双
      }
      if ((userNum%2) != 0 ) {
        result.push('tedan') // 特单
      }
      if (_.sum(hs) >= 7 ) {
        result.push('heda') // 和数特大
      }
      if (_.sum(hs) <= 6 ) {
        result.push('hexiao') // 和数特小
      }
      if ((_.sum(hs)%2) != 0) {
        result.push('hedan') // 和数单
      }
      if ((_.sum(hs)%2) == 0) {
        result.push('heshuang') // 和数双
      }
      if (_.last(hs) <= 4) {
        result.push('weida') // 尾数大
      }
      if (_.last(hs) >= 5) {
        result.push('weixiao') // 尾数小
      }
    }
    let is = result.some(o => o==v.qm)
    if (is) {
      this.countPrice(v.xdpl, v.xdjf);
    }

  },

  //特别号-> 尾数
  tbh_ws(v) {
    let tbh = _.last(this.curNum); // 特别号码
    let ws = _.last(tbh.toString().split(''));
    let userws = _.parseInt(_.replace(v.qm, 'ws_', ''));
    if (ws == ws) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  // 特别号-> 生肖
  tbh_sx(v) {
    let tbh = _.last(this.curNum); // 特别号码
    let list = _.find(Maps.sx, {'name': v.qm});
    let is = list.val.some(o => {
      return o == tbh;
    });
    if (is) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  // 特别号-> 波色
  tbh_bs(v) {
    let tbh = _.last(this.curNum); // 特别号码
    let is = Maps.bs[v.qm].some(o => o==tbh);
    if (is) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  zmt_bs(v) {
    let qm = v.qm.split('_');
    let f = parseInt(_.replace(qm[0], 'zm', ''));
    let l = parseInt(_.replace(qm[1], 'lm', ''));
    let a = this.curNum[f];
    let obj = {
      1: (a) => a >= 25,
      2: (a) => a <= 24,
      3: (a) => (a%2) != 0,
      4: (a) => (a%2) == 0,
      5: (a) =>  hs >= 7,
      6: (a) => hs <= 6,
      7: (a) => (_.sum(_.sum(a.toString().split('')))%2) != 0,
      8: (a) => (_.sum(_.sum(a.toString().split('')))%2) == 0,
      9: (a) => _.last(_.sum(a.toString().split(''))) <= 4,
      10: (a) => _.last(_.sum(a.toString().split(''))) >= 5,
      11: (a) => _.findIndex(Maps.bs.red, a),
      12: (a) => _.findIndex(Maps.bs.blue, a),
      13: (a) => _.findIndex(Maps.bs.green, a),
    }
    let is = obj[l](a);
    if (is) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  tbh_tmts(userNum, pl, jf) {
    let tbh = _.last(this.curNum);
    if (tbh <= 9) {

    }
    if (tbh >= 10 && tbh <= 19) {

    }
    if (tbh >= 20 && tbh <= 29) {

    }
    if (tbh >= 30 && tbh <= 39) {

    }
    if (tbh >= 40 && tbh <= 49) {

    }
  },

  // 总和 => 两面
  zh(v) {
    let allSum = _.sum(this.curNum);
    let result = [];
    if (allSum >= 175) {
      result.push('da');
    }
    if (allSum <= 174) {
      result.push('xiao');
    }
    if (allSum%2 == 0) {
      result.push('shuang');
    }
    if (allSum%2 != 0) {
      result.push('dan');
    }
    let is = result.some(o => o==v.qm);
    if (is) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  // 正码 => 号码
  zm_hm(v) {
    let more = _.remove(this.curNum, o => o==_.last(this.curNum))
    let is = more.some(o => o==_.replace(v.qm, 'zm', ''));
    if (is) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  // 正码过关
  zm_gg(v) {
    //keys: zm_1_2
    let qm = v.qm.split('_');
    let a = this.curNum[qm[1]];
    let obj = {
      1: (a) => a >= 25,
      2: (a) => a <= 24,
      3: (a) => (a%2) != 0,
      4: (a) => (a%2) == 0,
      5: (a) =>  hs >= 7,
      6: (a) => hs <= 6,
      7: (a) => (_.sum(_.sum(a.toString().split('')))%2) != 0,
      8: (a) => (_.sum(_.sum(a.toString().split('')))%2) == 0,
      9: (a) => _.last(_.sum(a.toString().split(''))) <= 4,
      10: (a) => _.last(_.sum(a.toString().split(''))) >= 5,
      11: (a) => _.findIndex(Maps.bs.red, a),
      12: (a) => _.findIndex(Maps.bs.blue, a),
      13: (a) => _.findIndex(Maps.bs.green, a),
    }
    let is = obj[qm[2]](qm[1]);
    if (is) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  //一肖
  yx(v) {
    // qm: yx_sx1
    let list = _.clone(this.curNum);
    _.pullAll(list, _.find(Maps.sx, {name: v.qm}).val);
    if (list.length<7) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  // 尾数
  ws(v) {
    // qm: ws_0
    let list = _.clone(this.curNum);
    let qm = v.qm.split('_')[1];
    _.pullAll(list, _.find(Maps.ws, {k: +qm}).val);
    if (list.length<7) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  // 合肖
  hx(v) {
    let qm = _.clone(this.curNum);
    let newList = _.concat()
    for(var i = 0; i < v.qms.length; i++) {
      let filterData = _.find(Maps.sx, {name: v.qms[i]}).val;
      newList = _.concat(newList, filterData);
    }
    _.pullAll(qm, newList);
    if (qm.length < 7) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  // 尾数连
  wsl(v) {
    let qm = _.clone(this.curNum);
    let sumLen = v.qms.length;
    let count = 0;
    for(var i = 0; i < v.qms.length; i++) {
      let list = _.find(Maps.ws, {k: +v.qms[i]}).val;
      let is = false;
      for(var j = 0; j < list.length; j++) {
        for(var o = 0; o < qm.length; o++) {
          if (qm[o] == list[j]) {
            is = true;
          }
        }
      }
      if (is) {
        count++;
      }
    }
    if (sumLen == count) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  // 生肖连
  sxl(v) {
    let qm = _.clone(this.curNum);
    let sumLen = v.qms.length;
    let count = 0;
    for(var i = 0; i < v.qms.length; i++) {
      let list = _.find(Maps.sx, {name: `sx${v.qms[i]}`}).val;
      let is = false;
      for(var j = 0; j < list.length; j++) {
        for(var o = 0; o < qm.length; o++) {
          if (qm[o] == list[j]) {
            is = true;
          }
        }
      }
      if (is) {
        count++;
      }
    }
    if (sumLen == count) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  // 全不中
  qbz(v) {
    let qm = _.clone(this.curNum);
    let qms = v.qms.map(i => parseInt(i));
    _.pullAll(qm, qms);
    if (qm.length == 7) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  lm(v) {
    //v.qm
    //qbz_4
    if (v.qm == 'qbz_4') {

    }
  },

  //正码特
  zmt(v) {
    let list = _.clone(this.curNum);
    let data = v.qm.split('');
    let zmIndex = _.replace(data[0], 'zm', '');
    let qm = _.replace(data[1], 'qm', '');
    if (list[zmIndex-1] == qm) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  }
};

/* module.exports = function (app) {
 *   app.use('/', router);
 * };*/

module.exports = match;
