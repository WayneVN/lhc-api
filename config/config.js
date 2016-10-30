var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'lhc'
    },
    port: 3000,
    db: 'mongodb://localhost/lhc-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'lhc'
    },
    port: 3000,
    db: 'mongodb://localhost/lhc-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'lhc'
    },
    port: 3000,
    db: 'mongodb://localhost/lhc-production'
  }
};

module.exports = config[env];
