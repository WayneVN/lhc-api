const mongoose = require('mongoose');
const ync = require('async');
const _ = require('lodash');
const User = mongoose.model('User');
const Reference = mongoose.model('Reference');
const Bet = mongoose.model('Bet');
const Maps = require('./maps');
const request = require('superagent');
const sscData = 'http://www.1680180.com/Open/CurrentOpen?code=10011';

let match = {
  init(k, v, dqqm, cb) {
    request.get(sscData).end((err, result) => {
      let r = JSON.parse(result.text);
      this.initData(k, v, dqqm, r, cb);
    });
  },

  initData(k, v, dqqm, r, cb) {
    this.sumPrice = []; // 总金额
    this.uid = k;
    this.result = r;

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

  dwt(v,r) {
    let q = v.qm.split('_');
    let curqm = _.find(this.result.list, {'c_t': +v.qs}).c_r.split(',');
    if (+q[2]<=9) {
      if (+curqm[q[1]-1] == +q[2]) {
        this.countPrice(v.xdpl, v.xdjf);
      }
    }
    if (+q[2]>9) {
      // some
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
