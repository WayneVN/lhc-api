const _ = require('lodash');

const publics = {
  baseLm: [{
    "keys": 'texiao',
    "name": "特小"
  }, {
    "keys": 'teda',
    "name": "特大"
  }, {
    "keys": 'tedan',
    "name": "特单"
  }, {
    "keys": 'teshuang',
    "name": "特双"
  }, {
    "keys": 'weida',
    "name": "尾大"
  }, {
    "keys": 'weixiao',
    "name": "尾小"
  }, {
    "keys": 'heda',
    "name": "合大"
  }, {
    "keys": 'hexiao',
    "name": "合小"
  }, {
    "keys": 'hedan',
    "name": "合单"
  }, {
    "keys": 'heshuang',
    "name": "合双"
  }],
  sx: [
    {
      name: 'sx1',
      k: '鼠',
      val: _.range(9, 46, 12)
    },
    {
      name: 'sx2',
      k: '牛',
      val: _.range(8, 45, 12)
    },
    {
      name:'sx3',
      k: '虎',
      val: _.range(7, 44, 12)
    },
    {
      name:'sx4',
      k: '兔',
      val: _.range(6, 43, 12)
    },
    {
      name:'sx5',
      k: '龙',
      val: _.range(5, 42, 12)
    },
    {
      name:'sx6',
      k: '蛇',
      val: _.range(4, 41, 12)
    },
    {
      name:'sx7',
      k: '马',
      val: _.range(3, 40, 12)
    },
    {
      name:'sx8',
      k: '羊',
      val: _.range(2, 39, 12)
    },
    {
      name:'sx9',
      k: '猴',
      val: _.range(1, 50, 12)
    },
    {
      name:'sx10',
      k: '鸡',
      val: _.range(12, 49, 12)
    },
    {
      name:'sx11',
      k: '狗',
      val: _.range(11, 48, 12)
    },
    {
      name:'sx12',
      k: '猪',
      val: _.range(10, 47, 12)
    },
  ],

  ws: _.range(10).map(item => {
    return {
      k: item,
      val: _.remove(_.range(item, 50, 10), o=> o!=0)
    }
  }),
  bs: {
    red: ["1", "2", "7", "8", "12", "13", "18", "19", "23", "24", "29", "30", "34", "35", "40", "45", "46"],
    blue: ["3", "4", "9", "10", "14", "15", "20", "25", "26", "31", "34", "36", "37", "41", "42", "47", "48"],
    green: ["5", "6", "11", "16", "17", "21", "22", "27", "28", "32", "33", "38", "39", "43", "44", "49"]
  },
  zmlm: [
    {
      name:'大码',
      k:1
    },
    {
      name:'小码',
      k:2
    },
    {
      name:'单码',
      k:3
    },
    {
      name:'双码',
      k:4
    },
    {
      name:'合大',
      k:5
    },
    {
      name:'合小',
      k:6
    },
    {
      name:'合单',
      k:7
    },
    {
      name:'合双',
      k:8
    },
    {
      name:'尾大',
      k:9
    },
    {
      name:'尾小',
      k:10
    },
    {
      name:'红波',
      k:11
    },
    {
      name:'蓝波',
      k:12
    },
    {
      name:'绿波',
      k:13
    }
  ],
  zh: [
    {
      name: '大',
      k:'da'
    },
    {
      name: '小',
      k:'xiao'
    },
    {
      name: '单',
      k:'dan'
    },
    {
      name: '双',
      k:'shuang'
    },
  ]
};

module.exports = publics;
