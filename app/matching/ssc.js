const mongoose = require('mongoose');
const ync = require('async');
const _ = require('lodash');
const User = mongoose.model('User');
const Reference = mongoose.model('Reference');
const Bet = mongoose.model('Bet');
const Rule = mongoose.model('rules');
const Maps = require('./maps');
const request = require('superagent');
const Qsdata = mongoose.model('qsdata');
const sscData = 'http://baidu.lecai.com/lottery/ajax_latestdrawn.php?lottery_type=200';
//const sscData = 'http://www.1680180.com/Open/CurrentOpen?code=10011';


let match = {
  init(k, v, dqqm, cb) {
    Qsdata.findOne({},{}, (err, rs) => {
      Rule.find({}, (err, result) => {
        let r = rs.lastList[0];
        if (r.result.result[0].data) {
          console.log('清算', '**************log***************');
          this.initData(k, v, dqqm, r, result,cb);
        }
      });
    });
  },

  initData(k, v, dqqm, r, db, cb) {
    this.sumPrice = []; // 总金额
    this.uid = k;
    this.result = r;
    this.dbmap = db;
    // 查找对应规则 db中types名称为函数名
    let is = false;
    for(let i = 0; i < v.length; i++) {
      if (+v[i].qs == +this.result.phase) {
        console.log(v[i].types, '**************log***************');

        this[v[i].types](v[i]);
        is = true;
      }
    }
    if (is) {
      this.fs(); //先反水再结算
    }
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
          if (!result || err) {
            console.log( '没有代理，不反水!');
            return ;
          }
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
    let curqm = this.result.result.result[0].data;
    curqm = curqm.map((item) => +item);
    let sqm  = +curqm[q[1]-1];//当前选中球码
    if (sqm == +q[2]) {
      this.countPrice(v.xdpl, v.xdjf);
    }
    /*     this.dbmap*/
    /*     }*/
    /* if (+q[2]==10) {
     *   if (sqm >= 5) {
     *     this.countPrice(v.xdpl, v.xdjf);
     *   }
     * }
     * if (+q[2]==11) {
     *   if (sqm < 5) {
     *     this.countPrice(v.xdpl, v.xdjf);
     *   }
     * }
     * if (+q[2]==12) {
     *   if (curqm[0] > curqm[4]) {
     *     this.countPrice(v.xdpl, v.xdjf);
     *   }
     * }
     * if (+q[2]==13) {
     *   if (curqm[0] < curqm[4]) {
     *     this.countPrice(v.xdpl, v.xdjf);
     *   }
     * }*/
  },

  lmt(v,r) {
    let q = v.qm.split('_');
    let curqm = this.result.result.result[0].data.map(item => +item);
    _.pullAll(curqm, q );
    if (q.length == q.length) {
      this.countPrice(v.xdpl, v.xdjf);
    }
  },

  lhh(v,r) {
    let q = v.qm.split('_');
    let curqm = this.result.result.result[0].data.map(item => +item);
    let sqm  = +curqm[q[1]-1];//当前选中球码
    if (+q[2]==1) {
      if (sqm >= 5) {
        this.countPrice(v.xdpl, v.xdjf);
      }
    }
    if (+q[2]==2) {
      if (sqm < 5) {
        this.countPrice(v.xdpl, v.xdjf);
      }
    }
    if (+q[2]==3) {
      if (sqm%2>0) {
        this.countPrice(v.xdpl, v.xdjf);
      }
    }
    if (+q[2]==4) {
      if (sqm%2==0) {
        this.countPrice(v.xdpl, v.xdjf);
      }
    }
    if (+q[2]==5) {
      if (curqm[0] > curqm[4]) {
        this.countPrice(v.xdpl, v.xdjf);
      }
    }
    if (+q[2]==6) {
      if (curqm[0] < curqm[4]) {
        this.countPrice(v.xdpl, v.xdjf);
      }
    }
    if (+q[2]==7) {
      if (curqm[0] == curqm[4]) {
        this.countPrice(v.xdpl, v.xdjf);
      }
    }
  },

  zhs(v,r) {
    let q = v.qm;
    let curqm = this.result.result.result[0].data.map(item => +item);
    let sums = _.sum(curqm);
    switch(sums) {
      case (q==1 && sums>23):
        this.countPrice(v.xdpl, v.xdjf);
        break;
      case (q==2 && sums<23):
        this.countPrice(v.xdpl, v.xdjf);
        break;
      case (q==3 && sums%2>0):
        this.countPrice(v.xdpl, v.xdjf);
        break;
      case (q==4 && sums%2 ==0):
        this.countPrice(v.xdpl, v.xdjf);
        break;
    }
  },

  dmt(v,r) {
    let q = v.qm;
    let curqm = this.result.result.result[0].data;
    if (curqm) {
      _.pullAll(curqm, q );
      if (curqm.length < 5) {
        let bs = 5-curqm.length;
        let obj = _.find(this.dbmap, ['name', `dmt_${bs}`]);
        this.countPrice(obj.num, v.xdjf);
      }
    }
  },

};


module.exports = match;
