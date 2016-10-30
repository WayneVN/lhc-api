const ync = require('async');
const _ = require('lodash');

let match = {
  init(nums) {
    this.curNum = nums; //当期开奖号码
    this.sumPrice = []; // 总金额
    this.tbh_lm(44,1,100);
    console.log(this.sumPrice, '**************log***************');
  },

  // 计算应得积分
  countPrice(pl, jf) {
    let sum = pl * jf + jf
    this.sumPrice.push(sum);
  },

  _switch() {

  },

  // 特别号=>号码
  tbh_hm(userNum, pl, jf) {
    let tbh = _.last(this.curNum);
    if (userNum == tbh) {
      this.countPrice(pl, jf);
    }
    else {
      this.countPrice(0, 0);
    }
  },

  // 特别号=>两面
  tbh_lm(userNum, pl, jf) {
    let tbh = _.last(this.curNum);
    let hs = tbh.toString().split('');
    let result = [];
    if (userNum == 49) {
        result.push('h') //和
    }
    else {
      if (userNum >= 25 && tbh != 49) {
        result.push('td'); //特大
      }
      if (userNum <= 24) {
        result.push('tx'); //特小
      }
      if ( (userNum%2) == 0 && tbh != 49) {
        result.push('ts') // 特双
      }
      if ((userNum%2) != 0 && tbh != 49) {
        result.push('tdan') // 特单
      }
      if (_.sum(hs) >= 7 && tbh != 49) {
        result.push('hstd') // 和数特大
      }
      if (_.sum(hs) <= 6 && tbh != 49) {
        result.push('hstx') // 和数特小
      }
      if ((_.sum(hs)%2) != 0 && tbh != 49) {
        result.push('hsd') // 和数单
      }
      if ((_.sum(hs)%2) == 0 && tbh != 49) {
        result.push('hss') // 和数双
      }
      if (_.last(hs) <= 4 && tbh != 49) {
        result.push('wsd') // 尾数大
      }
      if (_.last(hs) >= 5 && tbh != 49) {
        result.push('wsx') // 尾数小
      }
    }

  },

  /* 特码头数 ：指特别号所属头数的号码
   * "0"头 ：01，02，03，04，05，06，07，08，09
   * "1"头 ：10，11，12，13，14，15，16，17，18，19
   * "2"头 ：20，21，22，23，24，25，26，27，28，29
   * "3"头 ：30，31，32，33，34，35，36，37，38，39
   * "4"头 ：40，41，42，43，44，45，46，47，48，49
   * 例如 ：开奖结果特别号码是21则 "2"头为中奖，其他头数都不中奖*/
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

  // 正码特
  // 正码 => 号码
  // 总和 => 两面
  sums(userNum, pl, jf) {
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
  },

  // 一肖、尾数 => 一肖、尾数
  sx(userSwitch, pl, jf) {
    let list = _.range(1,12);
    let _index = _.findIndex(list, userSwitch);
    let result = [];
    if (_index>=0) {
      result.push(_index);
    }
  },

  //尾数
  ws(userNum, pl, jf) {
    let list = _.range(1,12);
    let _index = _.findIndex(list, userSwitch);
    let result = [];
  }
};

/* module.exports = function (app) {
 *   app.use('/', router);
 * };*/

module.exports = match;
